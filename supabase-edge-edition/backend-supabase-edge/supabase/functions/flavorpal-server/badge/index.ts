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
  
  const badges = data.filter((item) => item.badges !== null).map(item => {
    return {
      id: item.badge_id,
      badge: {
        id: item.badge_id,
        ref: item.badges?.description
      },
      createdAt: item.created_at
    }
  });

  return c.json(getCommonSuccess(badges));
})

// Get all possible badges
badgeRouter.get("/all", async (c) => {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("badges")
    .select("*");

  if (error) {
    return c.json(getCommonError(error.message))
  }
  
  const badges = data.map(item => {
    return {
      id: item.id,
      ref: item.description
    }
  })

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

  const { data: newBadgeData, error: badgeRetrievalError } = await client
    .from("user_badges")
    .select("*, badges(*)")
    .eq("user_id", userId)
    .eq("badge_id", badgeId)
    .single();

  if (badgeRetrievalError) {
    return c.json(getCommonError(badgeRetrievalError.message))
  }
  
  const dtoBadge = {
    id: newBadgeData.badge_id,
    badge: {
      id: newBadgeData.badge_id,
      ref: newBadgeData.badges?.description
    },
    createdAt: newBadgeData.created_at
  }

  return c.json(getCommonSuccess(dtoBadge, "Badge added successfully"));
})

export default badgeRouter;