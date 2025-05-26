import { createClient } from "jsr:@supabase/supabase-js@2";
import { Context } from "jsr:@hono/hono";
import { z } from "npm:zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const loginFn = async (c: Context) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({
      code: 401,
      error: parsed.error.errors,
      msg: "Invalid input",
    }, 401);
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    return c.json({
      code: 401,
      data: null,
      msg: error.message,
    }, 401);
  }
  return c.json({
    code: 200,
    data: {
      accessToken: data.session.access_token,
      tokenType: data.session.token_type,
    },
    msg: "Login successful",
  })
}

export default loginFn;