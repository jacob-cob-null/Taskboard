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
