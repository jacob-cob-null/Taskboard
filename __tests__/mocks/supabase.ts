import { createClient } from "@/utils/supabase/server";

// Mock the server client creator
jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

export const mockSupabase = {
  auth: {
    getUser: jest.fn(),
    signOut: jest.fn(),
    signInWithPassword: jest.fn(),
  },
};

// Helper to setup the mock implementation
export const setupSupabaseMock = () => {
  (createClient as jest.Mock).mockResolvedValue(mockSupabase);

  // Reset default behaviors
  mockSupabase.auth.getUser.mockReset();
  mockSupabase.auth.signOut.mockReset();
};

// Helper to mock an authenticated user
export const mockAuthenticatedUser = (
  userId: string,
  email: string = "test@example.com",
) => {
  mockSupabase.auth.getUser.mockResolvedValue({
    data: {
      user: {
        id: userId,
        email,
        aud: "authenticated",
        role: "authenticated",
        app_metadata: {},
        user_metadata: {},
        created_at: new Date().toISOString(),
      },
    },
    error: null,
  });
};

// Helper to mock unauthenticated state
export const mockUnauthenticatedUser = () => {
  mockSupabase.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: { message: "Not authenticated", name: "AuthError", status: 401 },
  });
};
