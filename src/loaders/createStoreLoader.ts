import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Store } from "@generated/type-graphql";

export const createStoreLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Store | null>(async (storeIds) => {
    const stores = await prisma.store.findMany({
      where: { id: { in: [...storeIds] } },
    });
    const storeIdsToMedia = stores.reduce<Record<string, Store>>(
      (carry, item) => {
        carry[item.id] = item;
        return carry;
      },
      {}
    );
    return storeIds.map((id) => storeIdsToMedia[id] || null);
  });
