import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Collection } from "@generated/type-graphql";

export const createCollectionLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Collection | null>(async (collectionIds) => {
    const collections = await prisma.collection.findMany({
      where: { id: { in: [...collectionIds] } },
    });
    const collectionIdsToMedia = collections.reduce<Record<string, Collection>>(
      (carry, item) => {
        carry[item.id] = item;
        return carry;
      },
      {}
    );
    return collectionIds.map((id) => collectionIdsToMedia[id] || null);
  });
