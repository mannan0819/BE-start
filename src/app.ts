import "reflect-metadata";
import Koa, { Context, Next } from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import { publicRouter } from "./router/user-router";
import authMiddleware from "./middleware/auth-middleware";
import { getUser } from "./db/User";
import { validateAndReturnUSER } from "./helpers/jwt";
import adminMiddleware from "./middleware/admin-middleware";

const app = new Koa();
app.proxy = true;
app.use(
  cors(
    {
    credentials: true,
    allowHeaders: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
      "Access-Control-Allow-Credentials",
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

app.use(async (ctx, next) => {
  if (ctx.path === "/") {
    ctx.status = 200;
    console.log('i am he')
  } else await next();
});

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
app.use(publicRouter.routes());
app.use(publicRouter.allowedMethods());

app.use(authMiddleware);

// app.use(adminMiddleware);

app.use(async (ctx: Context, next: Next) => {
    console.log("me");
    console.log(ctx.state.userState.data)
    const userFromToken = await validateAndReturnUSER(ctx);
    console.log('userFromToken')
    console.log(userFromToken)
    if(userFromToken) {
      console.log('userFromToken.data')
      console.log(userFromToken.data)
  
      console.log('userFromToken.data.userid')
      console.log(userFromToken.data.userid)
  
      ctx.body = await getUser(userFromToken.data.userid);
      ctx.status = 200;
    } else {
      ctx.status = 401;
    }
});

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
