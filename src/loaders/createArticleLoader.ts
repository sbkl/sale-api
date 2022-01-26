import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Article } from "@generated/type-graphql";

export const createArticleLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Article | null>(async (articleIds) => {
    const articles = await prisma.article.findMany({
      where: { id: { in: [...articleIds] } },
    });
    const articleIdsToArticle = articles.reduce<Record<string, Article>>(
      (carry, item) => {
        carry[item.id] = item;
        return carry;
      },
      {}
    );
    return articleIds.map((id) => articleIdsToArticle[id] || null);
  });
