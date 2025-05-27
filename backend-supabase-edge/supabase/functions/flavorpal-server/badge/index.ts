import { Hono } from "jsr:@hono/hono";
import getSupabaseClient from "../client.ts";
import { requireAuth } from "../middleware/auth.ts";
import { User } from "npm:@supabase/auth-js@2.69.1";
import { getCommonError, getCommonSuccess } from "../utils/commonResponse.ts";

type Variables = {
  user: User
}

const badgeRouter = new Hono<{ Variables: Variables }>()

badgeRouter.use(requireAuth);

// Get the badges for the user
badgeRouter.get("/", async (c) => {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("user_badges")
    .select("*, badges(*)")

  if (error) {
    return c.json(getCommonError(error.message))
  }
  
  const badges = data.filter((item) => item.badges !== null).map(item => item.badges);

  return c.json(getCommonSuccess(badges));
})

// Add a badge to the user
badgeRouter.post("/", async (c) => {
  const client = getSupabaseClient();
  const userId = c.get("user").id;

  const { badgeId } = await c.req.json();

  if (!badgeId) {
    return c.json({
      code: 400,
      data: null,
      msg: "Badge ID is required",
    });
  }

  const { data: _data, error } = await client
    .from("user_badges")
    .insert({ user_id: userId, badge_id: badgeId });

  if (error) {
    return c.json(getCommonError(error.message));
  }

  return c.json(getCommonSuccess(null, "Badge added successfully"));
})

export default badgeRouter;