// Edge Function: create-member
// Admin-only. Creates a real login account (service-role) for a team member, then
// fills in their profile. The service-role key never leaves the server.
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";

    // 1. Identify the caller from their JWT and confirm they're an admin.
    const caller = createClient(url, anon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: uErr } = await caller.auth.getUser();
    if (uErr || !user) return json(401, { error: "Not authenticated." });

    const { data: me } = await caller
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    if (!me?.is_admin) return json(403, { error: "Admins only." });

    // 2. Validate input.
    const { email, password, name, role, color } = await req.json();
    if (!email || !password) return json(400, { error: "Email and password are required." });
    if (String(password).length < 6) return json(400, { error: "Password must be at least 6 characters." });

    // 3. Create the auth user with the service role (auto-confirmed).
    const admin = createClient(url, service);
    const { data: created, error: cErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name ?? "" },
    });
    if (cErr || !created.user) {
      return json(400, { error: cErr?.message ?? "Could not create the account." });
    }

    // 4. Fill in the profile (the signup trigger already created the row).
    await admin
      .from("profiles")
      .update({
        name: name?.trim() || String(email).split("@")[0],
        role: role?.trim() || "Member",
        avatar_color: color || "#14B8C4",
        is_admin: false,
      })
      .eq("id", created.user.id);

    return json(200, { ok: true, id: created.user.id });
  } catch (e) {
    return json(500, { error: e instanceof Error ? e.message : String(e) });
  }
});
