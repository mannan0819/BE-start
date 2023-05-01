import Router from "@koa/router";
import { Context } from "koa";
import { RouterContext } from "@koa/router";
import { createAdmin, getUser, login } from "../db/User";
import { validateAndReturnUSER } from "../helpers/jwt";

export const userRouter = new Router({ prefix: `/user` });

userRouter.get("/create", async (ctx: RouterContext | Context) => {
  console.log("create user");
  ctx.body = await createAdmin();
  ctx.status = 200;
});

userRouter.get("/me", async (ctx: RouterContext | Context) => {
  console.log("me");
  const userFromToken = await validateAndReturnUSER(ctx);
  console.log('userFromToken')
  console.log(userFromToken)
  if(userFromToken) {
    console.log('userFromToken.data')
    console.log(userFromToken.data)

    console.log('userFromToken.data.userid')
    console.log(userFromToken.data.userid)

    ctx.body = getUser(userFromToken.data.userid);
    ctx.status = 200;
  } else {
    ctx.status = 401;
  }
});


userRouter.post("/login", async (ctx: RouterContext | Context) => {
  console.log("login user");
  const userName = (ctx.request.body as any).username;
  const password = (ctx.request.body as any).password;
  const loginRes = await login(
    userName, password
  );
  console.log('loginRes') 
  console.log(loginRes)
  if(loginRes) {
    const expireIn30 = new Date();
    expireIn30.setMinutes(expireIn30.getMinutes() + 30);
    ctx.cookies.set('userToken', loginRes.token , { httpOnly: true, expires: expireIn30, secure: true, sameSite: 'none', domain: 'mannanapps.site' });
    ctx.body = {...loginRes, token: undefined, password: undefined};

    ctx.status = 200;
  } else {
    ctx.status = 401;
  }
});
