import { createClient } from "jsr:@supabase/supabase-js@2";
import { Context, Next } from "jsr:@hono/hono";

export const requireAuth = async (c: Context, next: Next) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  const authHeader = c.req.header('Authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const authResult = await supabaseClient.auth.getUser(token);
  if (authResult.error || !authResult.data.user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  c.set('user', authResult.data.user);
  await next();
}