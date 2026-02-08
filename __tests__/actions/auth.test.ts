import { getUser, requireAuth, signOut } from "@/actions/auth";
import {
  mockAuthenticatedUser,
  mockUnauthenticatedUser,
  setupSupabaseMock,
  mockSupabase,
} from "@/__tests__/mocks/supabase";
import { redirect } from "next/navigation";

// Mock dependencies
jest.mock("@/utils/supabase/server");
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Auth Actions", () => {
  beforeEach(() => {
    setupSupabaseMock();
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("should return the user when authenticated", async () => {
      mockAuthenticatedUser("user-123");
      const result = await getUser();
      expect(result.data.user?.id).toBe("user-123");
    });

    it("should return null user when unauthenticated", async () => {
      mockUnauthenticatedUser();
      const result = await getUser();
      expect(result.data.user).toBeNull();
    });
  });

  describe("requireAuth", () => {
    it("should return user if authenticated", async () => {
      mockAuthenticatedUser("user-123");
      const user = await requireAuth();
      expect(user?.id).toBe("user-123");
      expect(redirect).not.toHaveBeenCalled();
    });

    it("should redirect to /login if unauthenticated", async () => {
      mockUnauthenticatedUser();

      try {
        await requireAuth();
      } catch (e) {
        // redirect throws an error in Next.js, catch it
      }

      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });

  describe("signOut", () => {
    it("should sign out and redirect", async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      try {
        await signOut();
      } catch (e) {
        // redirect throws
      }

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/login");
    });

    it("should log error if sign out fails", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockSupabase.auth.signOut.mockResolvedValue({
        error: { message: "Failed", name: "AuthError", status: 500 },
      });

      await signOut();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(redirect).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
