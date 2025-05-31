import { Context } from "jsr:@hono/hono";
import { getCommonError, getCommonSuccess } from "../utils/commonResponse.ts";

const logoutFn = (c: Context) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  if (!token) {
    return c.json(getCommonError("No token provided", 400));
  }
  // No way to revoke token, return success response
  return c.json(getCommonSuccess(null, "Logout successful", 200));
}

export default logoutFn;