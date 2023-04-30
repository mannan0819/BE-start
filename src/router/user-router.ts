import Router from "@koa/router";
import { Context } from "koa";
import { RouterContext } from "@koa/router";
import { createAdmin, login } from "../db/User";

export const userRouter = new Router({ prefix: `/user` });

userRouter.get("/create", async (ctx: RouterContext | Context) => {
  console.log("create user");
  ctx.body = await createAdmin();
  ctx.status = 200;
});

userRouter.post("/login", async (ctx: RouterContext | Context) => {
  console.log("login user");
  const userName = (ctx.request.body as any).username;
  const password = (ctx.request.body as any).password;
  const loginRes = await login(
    userName, password
  );
  if(loginRes) {
    ctx.body = loginRes;
    ctx.status = 200;
  } else {
    ctx.status = 401;
  }
});
