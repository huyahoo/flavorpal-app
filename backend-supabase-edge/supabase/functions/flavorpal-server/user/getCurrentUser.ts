import { Context } from "jsr:@hono/hono";
import { createClient } from "jsr:@supabase/supabase-js@2";


const getCurrentUserFn = async (c: Context) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      code: 401,
      data: null,
      error: "Not authenticated or session invalid."
    }, 401);
  }
  const token = authHeader.replace('Bearer ', '').trim();
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )
  const { data, error } = await supabaseClient.auth.getUser(token);
  if (error) {
    return c.json({
      code: 401,
      data: null,
      error: error.message,
    }, 401);
  }
  if (!data.user) {
    return c.json({
      code: 401,
      data: null,
      error: "Not authenticated or session invalid.",
    }, 401);
  }
  return c.json({
    code: 200,
    data: {
      id: data.user.id,
      name: data.user.user_metadata?.username || null,
      email: data.user.email,
      healthFlags: data.user.user_metadata?.healthFlags || [],
      badges: data.user.user_metadata?.badges || [],
      createdAt: data.user.created_at,
      updatedAt: data.user.updated_at,
    },
    msg: "Current user data fetched successfully."
  })
}

export default getCurrentUserFn;