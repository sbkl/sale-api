import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { User } from "@generated/type-graphql";

export const createUserLoader = (prisma: PrismaClient) =>
  new DataLoader<string, User | null>(async (userIds) => {
    const users = await prisma.user.findMany({
      where: { id: { in: [...userIds] } },
    });
    const userIdsToMedia = users.reduce<Record<string, User>>((carry, item) => {
      carry[item.id] = item;
      return carry;
    }, {});
    return userIds.map((id) => userIdsToMedia[id] || null);
  });
