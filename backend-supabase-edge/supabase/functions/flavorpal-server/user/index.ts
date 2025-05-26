import { Hono } from "jsr:@hono/hono";
import registerFn from "./register.ts";
import loginFn from "./login.ts";
import getCurrentUserFn from "./getCurrentUser.ts";

const userRouter = new Hono()

userRouter.post("/register", registerFn);
userRouter.post("/login", loginFn);
userRouter.get("/me", getCurrentUserFn)

export default userRouter;