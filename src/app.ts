import "reflect-metadata";
import Koa, { Context, Next } from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import { userRouter } from "./router/user-router";

const app = new Koa();

app.use(async (ctx, next) => {
  if (ctx.path === "/") {
    ctx.status = 200;
  } else await next();
});

app.use(
  cors({
    credentials: true,
    allowHeaders: [
      "Access-Control-Allow-Headers",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
      "Origin",
      "Accept",
      "X-Requested-With",
      "Content-Type",
      "rs-lang",
    ],
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS",
    origin: (ctx: Context) => {
      // if (
      //   ctx.request.header.origin!.startsWith("http://localhost")
      //   // && process.env.NODE_ENV?.toLocaleLowerCase() !== 'production'
      // ) {
        return ctx.request.header.origin!;
      // }

      if (ctx.request.header.origin!.endsWith(".test.dev")) {
        return ctx.request.header.origin!;
      }

      const productionOrigins = ["app.test.com"];

      if (
        productionOrigins.some((origin) =>
          ctx.request.header.origin!.endsWith(origin)
        )
      ) {
        return ctx.request.header.origin!;
      }

      return "";
    },
  })
);

// Log all requests
app.use(logger());

// Use body parser to parse JSON data on POST/PUT
app.use(
  bodyParser({
    extendTypes: {
      json: ["application/json"],
    },
  })
);

// HACK TO LOG OUT ERRORS
app.use(async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (e: any) {
    console.error(e);
    throw e;
  }
});

//create a user route
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
