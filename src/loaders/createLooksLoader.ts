import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Look } from "@generated/type-graphql";

export const createLooksLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Look[]>(async (collectionIds) => {
    const looks = await prisma.look.findMany({
      where: { collectionId: { in: [...collectionIds] } },
    });

    const looksByCollectionId = looks.reduce<Record<string, Look[]>>(
      (carry, item) => {
        carry[item.collectionId] = [...(carry[item.collectionId] || []), item];
        return carry;
      },
      {}
    );

    return collectionIds.map((id) => looksByCollectionId[id]);
  });
