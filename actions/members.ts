"use server";
import prisma from "@/utils/prisma/prisma";
import { getUser } from "./auth";
import { AddMemberSchema, ImportMembersSchema } from "@/lib/validations";

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

// Add member
export async function addMemberToTeam(
  teamId: string,
  email: string,
  fullName: string,
) {
  // Get user id
  const user = await getUser();
  const leaderId = user.data.user?.id;

  if (!user || !leaderId) {
    throw new Error("Unauthorized Action");
  }

  // Validate inputs
  const validation = AddMemberSchema.safeParse({
    email,
    full_name: fullName,
  });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid input",
    };
  }

  try {
    // Verify team ownership
    const team = await prisma.teams.findFirst({
      where: {
        id: teamId,
        leader_id: leaderId,
      },
    });

    if (!team) {
      return { success: false, error: "Unauthorized: Not team leader" };
    }

    // Check if member exists, create if not
    let member = await prisma.members.findUnique({
      where: { email },
    });

    if (!member) {
      member = await prisma.members.create({
        data: {
          email,
          full_name: fullName || null,
        },
      });
    }

    // Check if already a team member
    const existingMembership = await prisma.team_members.findUnique({
      where: {
        team_id_member_id: {
          team_id: teamId,
          member_id: member.id,
        },
      },
    });

    if (existingMembership) {
      return { success: false, error: "Member is already in this team." };
    }

    // Add to team
    await prisma.team_members.create({
      data: {
        team_id: teamId,
        member_id: member.id,
        created_by: leaderId,
      },
    });

    console.log("Success: Member added to team", teamId);
    return { success: true, member };
  } catch (error: unknown) {
    console.error("Error adding member to team:", error);
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return { success: false, error: "This email is already registered." };
    }
    return { success: false, error: "Failed to add member to team." };
  }
}

// Import members from csv
export async function importMembersToTeam(
  teamId: string,
  members: Array<{ email: string; full_name?: string }>,
) {
  // Get user id
  const user = await getUser();
  const leaderId = user.data.user?.id;

  if (!user || !leaderId) {
    throw new Error("Unauthorized Action");
  }

  // Validate inputs
  const validation = ImportMembersSchema.safeParse(members);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid member data",
    };
  }

  try {
    // Verify team ownership
    const team = await prisma.teams.findFirst({
      where: {
        id: teamId,
        leader_id: leaderId,
      },
    });

    if (!team) {
      return { success: false, error: "Unauthorized: Not team leader" };
    }

    let added = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const memberData of members) {
      try {
        // Check if member exists, create if not
        let member = await prisma.members.findUnique({
          where: { email: memberData.email },
        });

        if (!member) {
          member = await prisma.members.create({
            data: {
              email: memberData.email,
              full_name: memberData.full_name || null,
            },
          });
        }

        // Check if already a team member
        const existingMembership = await prisma.team_members.findUnique({
          where: {
            team_id_member_id: {
              team_id: teamId,
              member_id: member.id,
            },
          },
        });

        if (!existingMembership) {
          // Add to team
          await prisma.team_members.create({
            data: {
              team_id: teamId,
              member_id: member.id,
              created_by: leaderId,
            },
          });
          added++;
        } else {
          // Skip if already a member
          failed++;
          errors.push(`${memberData.email} is already in the team`);
        }
      } catch (error: unknown) {
        failed++;
        errors.push(
          `${memberData.email}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    console.log(`Import complete: ${added} added, ${failed} failed`);
    return { success: true, added, failed, errors };
  } catch (error: unknown) {
    console.error("Error importing members:", error);
    return { success: false, error: "Failed to import members." };
  }
}

// Get all members
export async function getMembersForTeam(teamId: string) {
  // Get user id
  const user = await getUser();
  const leaderId = user.data.user?.id;

  if (!user || !leaderId) {
    throw new Error("Unauthorized Action");
  }

  try {
    // Verify team ownership
    const team = await prisma.teams.findFirst({
      where: {
        id: teamId,
        leader_id: leaderId,
      },
    });

    if (!team) {
      return { success: false, error: "Unauthorized: Not team leader" };
    }

    const teamMembers = await prisma.team_members.findMany({
      where: { team_id: teamId },
      include: {
        members: true,
      },
      orderBy: {
        added_at: "desc",
      },
    });

    const members = teamMembers.map((tm) => ({
      id: tm.members.id,
      email: tm.members.email,
      full_name: tm.members.full_name,
      added_at: tm.added_at,
    }));

    return { success: true, members };
  } catch (error: unknown) {
    console.error("Error fetching members:", error);
    return { success: false, error: "Failed to fetch members." };
  }
}

// Update member
export async function updateMember(
  memberId: string,
  data: { email?: string; full_name?: string },
) {
  // Get user id
  const user = await getUser();
  const leaderId = user.data.user?.id;

  if (!user || !leaderId) {
    throw new Error("Unauthorized Action");
  }

  try {
    // Verify the member belongs to a team led by this user
    const teamMembership = await prisma.team_members.findFirst({
      where: {
        member_id: memberId,
        teams: {
          leader_id: leaderId,
        },
      },
    });

    if (!teamMembership) {
      return {
        success: false,
        error: "Unauthorized: Member not in your teams",
      };
    }

    const member = await prisma.members.update({
      where: { id: memberId },
      data,
    });

    console.log("Success: Updated member", memberId);
    return { success: true, member };
  } catch (error: unknown) {
    console.error("Error updating member:", error);
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return { success: false, error: "This email is already in use." };
    }
    return { success: false, error: "Failed to update member." };
  }
}

// Remove member
export async function removeMemberFromTeam(teamId: string, memberId: string) {
  // Get user id
  const user = await getUser();
  const leaderId = user.data.user?.id;

  if (!user || !leaderId) {
    throw new Error("Unauthorized Action");
  }

  try {
    // Verify team ownership
    const team = await prisma.teams.findFirst({
      where: {
        id: teamId,
        leader_id: leaderId,
      },
    });

    if (!team) {
      return { success: false, error: "Unauthorized: Not team leader" };
    }

    await prisma.team_members.delete({
      where: {
        team_id_member_id: {
          team_id: teamId,
          member_id: memberId,
        },
      },
    });

    console.log("Success: Removed member", memberId, "from team", teamId);
    return { success: true };
  } catch (error: unknown) {
    console.error("Error removing member:", error);
    return { success: false, error: "Failed to remove member." };
  }
}
