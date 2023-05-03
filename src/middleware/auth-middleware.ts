import { Context, Next } from "koa";
import { validateAndReturnUSER } from "../helpers/jwt";

/**
 * Sets a userId and clientId for use in routes and next middlewares.
 */
export default async (ctx: Context, next: Next) => {
  const userFromToken = await validateAndReturnUSER(ctx);
  if (userFromToken) {
    ctx.state.userState = userFromToken.data;
    await next();
  }
  else {
    ctx.status = 401;
  }
};
