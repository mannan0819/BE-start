import { Context, Next } from "koa";
import { validateAndReturnUSER } from "../helpers/jwt";

/**
 * Sets a userId and clientId for use in routes and next middlewares.
 */
export default async (ctx: Context, next: Next) => {
  const user = await validateAndReturnUSER(ctx);
  ctx.state.userId = user.userId;
  ctx.state.user = user.userToken;
  ctx.state.isAdmin = user.isAdmin;
  await next();
};
