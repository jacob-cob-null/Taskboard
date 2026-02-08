import {
  createTeam,
  deleteTeam,
  updateTeam,
  verifyTeamOwnership,
} from "@/actions/teams";
import { prismaMock } from "@/__tests__/mocks/prisma";
import {
  mockAuthenticatedUser,
  mockSupabase,
  setupSupabaseMock,
} from "@/__tests__/mocks/supabase";
import { createMockTeam } from "@/__tests__/helpers/fixtures";
import { redirect } from "next/navigation";

// Mock dependencies
jest.mock("@/utils/supabase/server");
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock calendar actions
jest.mock("@/actions/(calendar)/calendar", () => ({
  createTeamCalendar: jest.fn(),
  deleteTeamCalendar: jest.fn(),
  updateTeamCalendar: jest.fn(),
}));

import {
  createTeamCalendar,
  deleteTeamCalendar,
  updateTeamCalendar,
} from "@/actions/(calendar)/calendar";

describe("Team Actions", () => {
  const userId = "123e4567-e89b-12d3-a456-426614174000"; // Valid UUID
  const teamId = "123e4567-e89b-12d3-a456-426614174001"; // Valid UUID

  beforeEach(() => {
    setupSupabaseMock();
    mockAuthenticatedUser(userId);
    jest.clearAllMocks();
  });

  describe("createTeam", () => {
    it("should successfully create a team and calendar", async () => {
      const teamName = "New Team";
      const mockCalendarId = "calendar-123";

      // Mock calendar creation success
      (createTeamCalendar as jest.Mock).mockResolvedValue({
        success: true,
        calendarId: mockCalendarId,
      });

      // Mock prisma create
      const newTeam = createMockTeam({
        name: teamName,
        leader_id: userId,
        google_calendar_id: mockCalendarId,
      });
      prismaMock.teams.create.mockResolvedValue(newTeam);

      const result = await createTeam(teamName);

      expect(result.success).toBe(true);
      expect(result.team).toEqual(newTeam);
      expect(createTeamCalendar).toHaveBeenCalledWith(teamName);
      expect(prismaMock.teams.create).toHaveBeenCalledWith({
        data: {
          name: teamName,
          leader_id: userId,
          google_calendar_id: mockCalendarId,
        },
      });
    });

    it("should handle calendar creation failure gracefully", async () => {
      const teamName = "New Team";

      // Mock calendar creation failure
      (createTeamCalendar as jest.Mock).mockResolvedValue({
        success: false,
        error: "Calendar Error",
      });

      const newTeam = createMockTeam({
        name: teamName,
        leader_id: userId,
        google_calendar_id: null,
      });
      prismaMock.teams.create.mockResolvedValue(newTeam);

      const result = await createTeam(teamName);

      expect(result.success).toBe(true);
      expect(result.calendarCreated).toBe(false);
      // specific logic check: google_calendar_id should be null
    });
  });

  describe("verifyTeamOwnership", () => {
    it("should return team if user is leader", async () => {
      const mockTeam = createMockTeam({ id: teamId, leader_id: userId });
      prismaMock.teams.findFirst.mockResolvedValue(mockTeam);

      const result = await verifyTeamOwnership(teamId, userId);
      expect(result).toEqual(mockTeam);
    });

    it("should redirect if team not found or not leader", async () => {
      prismaMock.teams.findFirst.mockResolvedValue(null);

      try {
        await verifyTeamOwnership(teamId, userId);
      } catch (e) {
        // redirect
      }
      expect(redirect).toHaveBeenCalledWith("/dashboard");
    });

    it("should throw on invalid UUID", async () => {
      await expect(verifyTeamOwnership("invalid-uuid", userId)).rejects.toThrow(
        "Invalid team ID",
      );
    });
  });

  describe("deleteTeam", () => {
    it("should delete team and calendar", async () => {
      (deleteTeamCalendar as jest.Mock).mockResolvedValue({ success: true });
      prismaMock.teams.delete.mockResolvedValue({} as any);

      const result = await deleteTeam(teamId);

      expect(result.success).toBe(true);
      expect(deleteTeamCalendar).toHaveBeenCalledWith(teamId);
      expect(prismaMock.teams.delete).toHaveBeenCalledWith({
        where: { id: teamId },
      });
    });
  });

  describe("updateTeam", () => {
    it("should update team name and calendar", async () => {
      const newName = "Updated Team";
      (updateTeamCalendar as jest.Mock).mockResolvedValue({ success: true });
      prismaMock.teams.update.mockResolvedValue({} as any);

      const result = await updateTeam(teamId, newName);

      expect(result.success).toBe(true);
      expect(updateTeamCalendar).toHaveBeenCalledWith(teamId, newName);
    });
  });
});
