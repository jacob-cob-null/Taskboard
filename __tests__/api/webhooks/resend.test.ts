import { POST } from "@/app/api/webhooks/resend/route";
import { prismaMock } from "@/__tests__/mocks/prisma";
import { createMockAnnouncement } from "@/__tests__/helpers/fixtures";
import { NextRequest } from "next/server";
import { Webhook } from "svix";

// Mock Svix to avoid real signature verification
jest.mock("svix");

describe("Resend Webhook API", () => {
  const mockWebhookSecret = "whsec_test_secret";

  beforeEach(() => {
    process.env.RESEND_WEBHOOK_SECRET = mockWebhookSecret;
    jest.clearAllMocks();

    // Mock Webhook verify method
    (Webhook as unknown as jest.Mock).mockImplementation(() => ({
      verify: jest.fn().mockReturnValue({
        type: "email.delivered",
        data: {
          created_at: "2024-01-01T00:00:00.000Z",
          email_id: "email_123",
          to: ["test@example.com"],
          batch_id: "batch_123",
        },
      }),
    }));
  });

  afterEach(() => {
    delete process.env.RESEND_WEBHOOK_SECRET;
  });

  const createRequest = (body: string) => {
    return new NextRequest("http://localhost/api/webhooks/resend", {
      method: "POST",
      headers: {
        "svix-id": "msg_123",
        "svix-timestamp": "1234567890",
        "svix-signature": "v1,signature_123",
        "content-type": "application/json",
      },
      body,
    });
  };

  it("should process delivered event and update counts", async () => {
    const payload = JSON.stringify({ type: "email.delivered" });
    const req = createRequest(payload);

    // Mock finding announcement
    const announcements = [
      createMockAnnouncement({
        id: BigInt(1),
        resend_batch_id: "batch_123",
        delivered_count: 0,
        recipient_count: 10,
      }),
    ];

    // Mock findMany with the OR condition we fixed
    prismaMock.announcements.findMany.mockResolvedValue(announcements as any);

    // Mock update
    prismaMock.announcements.update.mockResolvedValue({} as any);
    // Mock findUnique for status check
    prismaMock.announcements.findUnique.mockResolvedValue(
      announcements[0] as any,
    );

    const response = await POST(req);

    expect(response.status).toBe(200);
    expect(prismaMock.announcements.update).toHaveBeenCalled();
    expect(prismaMock.announcements.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { resend_batch_id: "batch_123" },
            { resend_batch_id: { contains: "batch_123" } },
          ],
        },
      }),
    );
  });

  it("should return 200 but warn if batch ID matches nothing", async () => {
    const payload = JSON.stringify({ type: "email.delivered" });
    const req = createRequest(payload);

    prismaMock.announcements.findMany.mockResolvedValue([]);

    const response = await POST(req);
    expect(response.status).toBe(200); // Idempotent success
  });

  it("should return 500 if webhook secret is missing", async () => {
    delete process.env.RESEND_WEBHOOK_SECRET;
    const req = createRequest("{}");
    const response = await POST(req);
    expect(response.status).toBe(500);
  });
});
