import Router from "@koa/router";
import { Context } from "koa";
import { RouterContext } from "@koa/router";
import { getAllUsers } from "../db/User";

export const adminRouter = new Router({ prefix: `/admin` });

adminRouter.get("/users", async (ctx: RouterContext | Context) => {
    ctx.body = await getAllUsers();
    ctx.status = 200;
});

