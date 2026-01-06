import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

// Using Deno.serve per guidelines
Deno.serve(async (req: Request) => {
  try {
    // Only allow POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, message: "Method not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { userId, googleRefreshToken, email, fullName, avatarUrl } = body;
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: "userId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build SQL parameters safely
    // Use Supabase DB URL to call Postgres directly
    const dbUrl = Deno.env.get("SUPABASE_DB_URL");
    if (!dbUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Database URL not configured",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use fetch to call Postgres via connection string -- Use pg client would require npm; instead use RESTful SQL via Supabase REST? Not available. Instead use Postgres via Deno Postgres driver is not allowed. But Supabase provides REST admin via /rest/v1? We'll use the Supabase Admin REST endpoint using SUPABASE_URL and SERVICE_ROLE_KEY

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Supabase env vars missing",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Upsert the profile
    const profilePayload: any = { id: userId };
    if (email !== undefined) profilePayload.email = email;
    if (fullName !== undefined) profilePayload.full_name = fullName;
    if (avatarUrl !== undefined) profilePayload.avatar_url = avatarUrl;
    if (googleRefreshToken !== undefined)
      profilePayload.google_refresh_token = googleRefreshToken;

    // Build PATCH (upsert) request to profiles table via Supabase REST
    // Use POST with Prefer: resolution=merge-duplicates for upsert on conflict

    const res = await fetch(`${supabaseUrl}/rest/v1/profiles?on_conflict=id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(profilePayload),
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({
          success: false,
          message: "Database request failed",
          detail: text,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Token stored successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
