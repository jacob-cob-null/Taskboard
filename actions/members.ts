"use server";
import prisma from "@/utils/prisma/prisma";

export async function addMember(email: string, name: string) {
  try {
    const member = await prisma.members.create({
      data: {
        email: email,
        full_name: name,
      },
    });

    console.log("Success: Member created with ID", member.id);
    return { success: true, member };
  } catch (error: unknown) {
    // Throw error on duplicate emails
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return { success: false, error: "This email is already registered." };
    }
    return { success: false, error: "Database connection failed." };
  }
}

// TODO: Implement authorization check - verify requester is team leader
export async function getMembersForTeam(teamId: string) {
  try {
    // TODO: Implement actual database query
    // const members = await prisma.team_members.findMany({
    //   where: { team_id: teamId },
    //   include: { member: true },
    // });

    // Mock data for UI development
    return {
      success: true,
      members: [
        {
          id: "1",
          email: "john.doe@example.com",
          full_name: "John Doe",
          added_at: new Date("2026-01-15"),
        },
        {
          id: "2",
          email: "jane.smith@example.com",
          full_name: "Jane Smith",
          added_at: new Date("2026-01-20"),
        },
      ],
    };
  } catch (error: unknown) {
    return { success: false, error: "Failed to fetch members." };
  }
}

// TODO: Implement authorization check - verify requester is team leader
export async function updateMember(
  memberId: string,
  data: { email?: string; full_name?: string },
) {
  try {
    // TODO: Implement actual database update
    // const member = await prisma.members.update({
    //   where: { id: memberId },
    //   data,
    // });

    console.log("TODO: Update member", memberId, data);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: "Failed to update member." };
  }
}

// TODO: Implement authorization check - verify requester is team leader
export async function removeMemberFromTeam(teamId: string, memberId: string) {
  try {
    // TODO: Implement actual database deletion from team_members join table
    // await prisma.team_members.delete({
    //   where: {
    //     team_id_member_id: {
    //       team_id: teamId,
    //       member_id: memberId,
    //     },
    //   },
    // });

    console.log("TODO: Remove member", memberId, "from team", teamId);
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: "Failed to remove member." };
  }
}
