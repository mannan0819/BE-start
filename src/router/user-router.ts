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

userRouter.get("/login", async (ctx: RouterContext | Context) => {
  console.log("login user");
  ctx.body = await login(
    ctx.query.email as string,
    ctx.query.password as string,
  );
  ctx.status = 200;
});

userRouter.post("/login", async (ctx: RouterContext | Context) => {
  console.log("login user");
  const userName = (ctx.request.body as any).username;
  const password = (ctx.request.body as any).password;
  ctx.body = await login(
userName, password
  );
  ctx.status = 200;
});
