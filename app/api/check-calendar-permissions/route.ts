import { NextResponse } from "next/server";
import { checkCalendarPermissions } from "@/actions/calendar";

export async function GET() {
  try {
    const result = await checkCalendarPermissions();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { hasValidToken: false, needsReauth: true },
      { status: 500 },
    );
  }
}
