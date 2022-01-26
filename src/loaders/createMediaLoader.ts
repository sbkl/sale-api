import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Media } from "@generated/type-graphql";

export const createMediaLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Media | null>(async (mediaIds) => {
    const medias = await prisma.media.findMany({
      where: { id: { in: [...mediaIds] } },
      orderBy: {
        number: "asc",
      },
    });
    const mediaIdsToMedia = medias.reduce<Record<string, Media>>(
      (carry, item) => {
        carry[item.id] = item;
        return carry;
      },
      {}
    );
    return mediaIds.map((id) => mediaIdsToMedia[id] || null);
  });
