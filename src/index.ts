import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema, ResolverData } from "type-graphql";
import Redis from "ioredis";
import session, { Session } from "express-session";
import connectRedis from "connect-redis";
import { COOKIE_NAME, __prod__ } from "./constants";
import cors from "cors";
import { graphqlUploadExpress } from "graphql-upload";
import { MyContext } from "./types";
import { Container } from "typedi";
import { v4 } from "uuid";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { prisma } from "./lib/prisma";
import { createServer } from "http";

import {
  ArticleResolver,
  EventResolver,
  MarketResolver,
  MaterialResolver,
  MediaResolver,
  MediableResolver,
  OfficeResolver,
  PriceResolver,
  RegionResolver,
  StoreResolver,
  UserResolver,
  CollectionResolver,
  LookResolver,
  CartResolver,
  CartItemResolver,
  TransactionItemResolver,
} from "./resolvers";
import { PubSub } from "./PubSub";
import {} from "./loaders/createMaterialLoader";

import {
  createArticlesLoader,
  createCollectionsLoader,
  createMaterialLoader,
  createMediaLoader,
  createMediableLoader,
  createLooksLoader,
  createCollectionLoader,
  createPricesLoader,
  createStoreLoader,
  createMarketLoader,
  createUserLoader,
  createTransactionItemsLoader,
  createArticleLoader,
  createCartItemsLoader,
  createLookLoader,
} from "./loaders";

// import path from "path";

// This is a workaround till BigInt is fully supported by the standard
// See https://tc39.es/ecma262/#sec-ecmascript-language-types-bigint-type
// and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
// If this is not done, then a JSON.stringify(BigInt) throws
// "TypeError: Do not know how to serialize a BigInt"
/* global BigInt:writable */
/* eslint no-extend-native: ["error", { "exceptions": ["BigInt"] }] */
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const main = async () => {
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  // app.get("/graphql", (_req, res) => {
  //   res.sendFile(path.join(__dirname, "./graphiql-over-ws.html"));
  // });
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  const sessionMiddleware = session({
    name: COOKIE_NAME,
    store: new RedisStore({
      client: redis,
      disableTouch: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
      httpOnly: true,
      sameSite: "lax",
      secure: __prod__,
      domain: __prod__ ? process.env.COOKIE_DOMAIN : undefined,
    },
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  });

  app.use(sessionMiddleware);
  app.use(
    graphqlUploadExpress({
      maxFieldSize: 10000000000000,
      maxFileSize: 10000000000000,
      maxFiles: 10,
    })
  );

  const schema = await buildSchema({
    resolvers: [
      ArticleResolver,
      EventResolver,
      MarketResolver,
      MaterialResolver,
      MediaResolver,
      MediableResolver,
      OfficeResolver,
      PriceResolver,
      RegionResolver,
      StoreResolver,
      UserResolver,
      CollectionResolver,
      LookResolver,
      CartResolver,
      CartItemResolver,
      TransactionItemResolver,
    ],
    validate: false,
    pubSub: PubSub,
    container: ({ context }: ResolverData<MyContext>) => context.container,
    // authChecker: customAuthChecker,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): MyContext => {
      const requestId = v4();
      const container = Container.of(requestId);
      const context = {
        requestId,
        container,
        prisma,
        req,
        res,
        redis,
        materialLoader: createMaterialLoader(prisma),
        articlesLoader: createArticlesLoader(prisma),
        collectionsLoader: createCollectionsLoader(prisma),
        collectionLoader: createCollectionLoader(prisma),
        mediaLoader: createMediaLoader(prisma),
        mediableLoader: createMediableLoader(prisma),
        looksLoader: createLooksLoader(prisma),
        pricesLoader: createPricesLoader(prisma),
        storeLoader: createStoreLoader(prisma),
        marketLoader: createMarketLoader(prisma),
        userLoader: createUserLoader(prisma),
        transactionItemsLoader: createTransactionItemsLoader(prisma),
        articleLoader: createArticleLoader(prisma),
        cartItemsLoader: createCartItemsLoader(prisma),
        lookLoader: createLookLoader(prisma),
      };
      container.set("context", context);
      return context;
    },
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      {
        requestDidStart: async () => ({
          async willSendResponse(requestContext) {
            // remember to dispose the scoped container to prevent memory leaks
            Container.reset(requestContext.context.requestId);
            // for developers curiosity purpose, here is the logging of current scoped container instances
            // we can make multiple parallel requests to see in console how this works
            // const instancesIds = (
            //   (Container as any).instances as ContainerInstance[]
            // ).map((instance) => instance.id);
            // console.log("instances left in memory:", instancesIds);
          },
        }),
      },
    ],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  const server = createServer(app);

  server.listen(parseInt(process.env.PORT as string), () => {
    // create and use the websocket server
    const wsServer = new WebSocketServer({
      server,
      path: "/graphql",
    });

    useServer<{ requestId: string }>(
      {
        onConnect: (ctx) => {
          return new Promise((resolve) => {
            const requestId = v4();
            ctx.extra.requestId = requestId;
            const req = ctx.extra.request as express.Request;
            const res = {} as any as express.Response;

            sessionMiddleware(req, res, (_: any) => {
              const session = req.session as Session;

              const userId = session.userId;

              resolve({ userId });
            });
          });
        },
        onComplete: (ctx) => {
          // remember to dispose the scoped container to prevent memory leaks
          Container.reset(ctx.extra.requestId);
          // for developers curiosity purpose, here is the logging of current scoped container instances
          // we can make multiple parallel requests to see in console how this works
          // const instancesIds = (
          //   (Container as any).instances as ContainerInstance[]
          // ).map((instance) => instance.id);
          // console.log("instances left in memory:", instancesIds);
        },
        context: (ctx) => {
          const container = Container.of(ctx.extra.requestId);
          const context = {
            requestId: ctx.extra.requestId,
            container,
            prisma,
            req: ctx.extra.request,
            redis,
            materialLoader: createMaterialLoader(prisma),
            articlesLoader: createArticlesLoader(prisma),
            collectionsLoader: createCollectionsLoader(prisma),
            collectionLoader: createCollectionLoader(prisma),
            mediaLoader: createMediaLoader(prisma),
            mediableLoader: createMediableLoader(prisma),
            pricesLoader: createPricesLoader(prisma),
            storeLoader: createStoreLoader(prisma),
            marketLoader: createMarketLoader(prisma),
            userLoader: createUserLoader(prisma),
            transactionItemsLoader: createTransactionItemsLoader(prisma),
            articleLoader: createArticleLoader(prisma),
            cartItemsLoader: createCartItemsLoader(prisma),
            lookLoader: createLookLoader(prisma),
          };
          container.set("context", context);
          return context;
        },
        schema,
      },
      wsServer
    );
    console.log(`listening on port ${process.env.PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
