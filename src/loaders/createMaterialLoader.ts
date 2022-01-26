import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Article, Look, Material, Media } from "@generated/type-graphql";

export const createMaterialLoader = (prisma: PrismaClient) =>
  new DataLoader<Article | Look | Media, Material[] | Material | null>(
    async (models) => {
      const ids = models.map((m) => m.id);

      if (isLook(models[0])) {
        const looks = [...models] as Look[];
        const materials = await prisma.material.findMany({
          where: {
            looks: { some: { lookId: { in: ids } } },
            articles: { some: { stock: { gt: 0 } } },
          },
          include: { looks: true },
        });

        const lookIdsToMaterials = ids.reduce<Record<string, Material[]>>(
          (carry, lookId) => {
            carry[lookId] = materials.filter(
              (m) => m.looks.findIndex((l) => l.lookId === lookId) > -1
            );
            return carry;
          },
          {}
        );
        return looks.map((model: Look) => lookIdsToMaterials[model.id]);
      } else if (isMedia(models[0])) {
        const medias = [...models] as Media[];

        const mediables = await prisma.mediable.findMany({
          where: { mediaId: { in: ids } },
        });

        const materials = await prisma.material.findMany({
          where: { id: { in: mediables.map((m) => m.mediableId) } },
        });

        const mediaIdsToMaterial = ids.reduce<Record<string, Material>>(
          (carry, mediaId) => {
            const mediable = mediables.find((m) => m.mediaId === mediaId);
            if (mediable) {
              const material = materials.find(
                (m) => m.id === mediable.mediableId
              );
              if (material) {
                carry[mediaId] = material;
              }
            }
            return carry;
          },
          {}
        );
        return medias.map((model: Media) => mediaIdsToMaterial[model.id]);
      } else {
        const articles = [...models] as Article[];
        const materials = await prisma.material.findMany({
          where: { articles: { some: { id: { in: ids } } } },
          include: { articles: true },
        });
        const articleIdsToMaterial = ids.reduce<Record<string, Material>>(
          (carry, articleId) => {
            const material = materials.find(
              (m) => m.articles.findIndex((a) => a.id === articleId) > -1
            );
            if (material) {
              carry[articleId] = material;
            }
            return carry;
          },
          {}
        );
        return articles.map((model: Article) => articleIdsToMaterial[model.id]);
      }
    }
  );

function isLook(look?: any): look is Look {
  if (!look) return false;
  return (look as Look).lookName != undefined;
}

function isMedia(media?: any): media is Media {
  if (!media) return false;
  return (media as Media).mimetype != undefined;
}
