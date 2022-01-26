import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Price } from "@generated/type-graphql";

export const createPricesLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Price[]>(async (materialIds) => {
    const prices = await prisma.price.findMany({
      where: { materialId: { in: [...materialIds] } },
    });

    const pricesByMaterialId = prices.reduce<Record<string, Price[]>>(
      (carry, item) => {
        carry[item.materialId] = [...(carry[item.materialId] || []), item];
        return carry;
      },
      {}
    );

    return materialIds.map((id) => pricesByMaterialId[id]);
  });
