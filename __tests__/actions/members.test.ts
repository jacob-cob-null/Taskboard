import {
  addMemberToTeam,
  getMembersForTeam,
  importMembersToTeam,
  removeMemberFromTeam,
  updateMember,
} from "@/actions/members";
import { prismaMock } from "@/__tests__/mocks/prisma";
import {
  mockAuthenticatedUser,
  mockSupabase,
  setupSupabaseMock,
} from "@/__tests__/mocks/supabase";
import { createMockMember, createMockTeam } from "@/__tests__/helpers/fixtures";

// Mock dependencies
jest.mock("@/utils/supabase/server");

describe("Member Actions", () => {
  const userId = "user-123";
  const teamId = "team-123";

  beforeEach(() => {
    console.log("Prisma Mock:", prismaMock); // Debug log
    setupSupabaseMock();
    mockAuthenticatedUser(userId);
    jest.clearAllMocks();
  });

  describe("addMemberToTeam", () => {
    it("should successfully add a new member", async () => {
      const email = "new@example.com";
      const fullName = "New Member";
      const mockTeam = createMockTeam({ id: teamId, leader_id: userId });

      // Mock team ownership check
      prismaMock.teams.findFirst.mockResolvedValue(mockTeam);

      // Mock existing member check (not found)
      prismaMock.members.findUnique.mockResolvedValue(null);
      // Mock create member
      const newMember = createMockMember({ email, full_name: fullName });
      prismaMock.members.create.mockResolvedValue(newMember);

      // Mock existing membership
      prismaMock.team_members.findUnique.mockResolvedValue(null);

      // Mock create membership
      prismaMock.team_members.create.mockResolvedValue({} as any);

      const result = await addMemberToTeam(teamId, email, fullName);

      expect(result.success).toBe(true);
      expect(prismaMock.teams.findFirst).toHaveBeenCalledWith({
        where: { id: teamId, leader_id: userId },
      });
      expect(prismaMock.team_members.create).toHaveBeenCalled();
    });

    it("should fail if user is not authorized", async () => {
      // Mock no user
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(
        addMemberToTeam(teamId, "test@test.com", "Test"),
      ).rejects.toThrow("Unauthorized Action");
    });

    it("should return error for invalid email", async () => {
      const result = await addMemberToTeam(teamId, "invalid-email", "Name");
      expect(result.success).toBe(false);
      expect(result.error).toContain("Must be a valid email address");
    });
  });

  describe("getMembersForTeam", () => {
    it("should return members for a team", async () => {
      const mockTeam = createMockTeam({ id: teamId, leader_id: userId });
      prismaMock.teams.findFirst.mockResolvedValue(mockTeam);

      const members = [
        {
          member: createMockMember({ email: "m1@test.com" }),
          added_at: new Date(),
        },
        {
          member: createMockMember({ email: "m2@test.com" }),
          added_at: new Date(),
        },
      ];

      // Mock prisma response structure roughly matching the include
      prismaMock.team_members.findMany.mockResolvedValue(members as any);

      const result = await getMembersForTeam(teamId);

      // Verify object return structure
      if (result.success) {
        expect(result.members).toHaveLength(2);
        expect(result.members![0].email).toBe("m1@test.com");
      } else {
        fail("Expected success to be true");
      }
    });
  });

  describe("importMembersToTeam", () => {
    it("should import valid members", async () => {
      const membersToImport = [
        { email: "test1@example.com", full_name: "Test 1" },
        { email: "test2@example.com", full_name: "Test 2" },
      ];

      const mockTeam = createMockTeam({ id: teamId, leader_id: userId });
      prismaMock.teams.findFirst.mockResolvedValue(mockTeam);

      // Mock member check/create
      prismaMock.members.findUnique.mockResolvedValue(null);
      prismaMock.members.create.mockImplementation(
        (args) => createMockMember({ email: args.data.email }) as any,
      );

      // Mock team membership check/create
      prismaMock.team_members.findUnique.mockResolvedValue(null);
      prismaMock.team_members.create.mockResolvedValue({} as any);

      const result = await importMembersToTeam(teamId, membersToImport);

      expect(result.success).toBe(true);
      // Verify added count
      if (result.success) {
        expect(result.added).toBe(2);
      }
    });

    it("should handle partial failures or invalid data gracefully", async () => {
      const invalidMembers = [{ email: "invalid", full_name: "Bad" }];
      const result = await importMembersToTeam(teamId, invalidMembers);

      // Validation failure returns early
      expect(result.success).toBe(false);
    });
  });

  describe("removeMemberFromTeam", () => {
    it("should remove a member", async () => {
      const memberId = "member-1";
      const mockTeam = createMockTeam({ id: teamId, leader_id: userId });
      prismaMock.teams.findFirst.mockResolvedValue(mockTeam);

      prismaMock.team_members.delete.mockResolvedValue({} as any);

      const result = await removeMemberFromTeam(teamId, memberId);

      expect(result.success).toBe(true);
      expect(prismaMock.team_members.delete).toHaveBeenCalled();
    });
  });
});
