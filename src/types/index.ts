import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";
import { ContainerInstance } from "typedi";
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
} from "../loaders";

export type MyContext = {
  requestId: string;
  container: ContainerInstance;
  prisma: PrismaClient;
  req: Request & { session: Session };
  res: Response;
  redis: Redis;
  collectionsLoader: ReturnType<typeof createCollectionsLoader>;
  collectionLoader: ReturnType<typeof createCollectionLoader>;
  materialLoader: ReturnType<typeof createMaterialLoader>;
  articlesLoader: ReturnType<typeof createArticlesLoader>;
  looksLoader: ReturnType<typeof createLooksLoader>;
  mediableLoader: ReturnType<typeof createMediableLoader>;
  mediaLoader: ReturnType<typeof createMediaLoader>;
  pricesLoader: ReturnType<typeof createPricesLoader>;
  storeLoader: ReturnType<typeof createStoreLoader>;
  marketLoader: ReturnType<typeof createMarketLoader>;
  userLoader: ReturnType<typeof createUserLoader>;
  transactionItemsLoader: ReturnType<typeof createTransactionItemsLoader>;
  articleLoader: ReturnType<typeof createArticleLoader>;
  cartItemsLoader: ReturnType<typeof createCartItemsLoader>;
  lookLoader: ReturnType<typeof createLookLoader>;
};
