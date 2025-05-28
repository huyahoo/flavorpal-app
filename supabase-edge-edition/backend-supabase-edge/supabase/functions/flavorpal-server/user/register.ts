import { Context } from "jsr:@hono/hono";
import { z } from "npm:zod"
import { createClient } from "jsr:@supabase/supabase-js@2";

const registerSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  healthFlags: z.array(z.string()).optional(),
})


const registerFn = async (c: Context) => {
  const body = await c.req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: parsed.error.errors }, 400);
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )
  const response = await supabaseClient.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    user_metadata: {
      username: parsed.data.username,
      healthFlags: parsed.data.healthFlags || [],
    },
    email_confirm: true, // Automatically confirm email, remove in production
  });
  if (response.error) {
    return c.json({
      code: 400,
      data: null,
      error: response.error.message,
    }, 400);
  };
  

  return c.json({
    code: 201,
    data: {
      id: response.data.user.id,
      email: response.data.user.email,
      healthFlags: response.data.user.user_metadata.healthFlags || [],
      badges: []
    },
    msg: "User created successfully. Please login."
  })
}

export default registerFn;