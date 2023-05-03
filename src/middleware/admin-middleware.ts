import { Context, Next } from "koa";

/**
 * Sets a userId and clientId for use in routes and next middlewares.
 */
export default async (ctx: Context, next: Next) => {
  if (ctx.state.userState && ctx.state.userState.isAdmin) {
    console.log('this person is an admin')
    await next();
  }
  else {
    ctx.status = 401;
  }
};
