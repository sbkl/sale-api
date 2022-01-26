import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Article } from "@generated/type-graphql";

export const createArticlesLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Article[]>(async (materialIds) => {
    const articles = await prisma.article.findMany({
      where: { materialId: { in: [...materialIds] } },
    });

    const articlesByMaterialId = articles.reduce<Record<string, Article[]>>(
      (carry, item) => {
        carry[item.materialId] = [...(carry[item.materialId] || []), item];
        return carry;
      },
      {}
    );

    return materialIds.map((id) => articlesByMaterialId[id]);
  });
