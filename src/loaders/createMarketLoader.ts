import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Market } from "@generated/type-graphql";

export const createMarketLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Market | null>(async (marketIds) => {
    const markets = await prisma.market.findMany({
      where: { id: { in: [...marketIds] } },
    });
    const marketIdsToMedia = markets.reduce<Record<string, Market>>(
      (carry, item) => {
        carry[item.id] = item;
        return carry;
      },
      {}
    );
    return marketIds.map((id) => marketIdsToMedia[id] || null);
  });
