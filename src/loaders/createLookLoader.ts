import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Look } from "@generated/type-graphql";

export const createLookLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Look | null>(async (articleIds) => {
    const articles = await prisma.article.findMany({
      where: {
        id: { in: [...articleIds] },
      },
    });

    const looks = await prisma.look.findMany({
      where: {
        materials: {
          some: { materialId: { in: [...articles.map((a) => a.materialId)] } },
        },
      },
      include: {
        materials: {
          include: {
            material: {
              include: {
                articles: true,
              },
            },
          },
        },
      },
    });
    return articleIds.map((articleId) => {
      const look = looks.find((look) => {
        return look.materials.find((m) =>
          m.material.articles.map((a) => a.id).includes(articleId)
        );
      });
      if (look) {
        return look;
      }
      return null;
    });
  });
