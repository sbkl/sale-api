import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Collection } from "@generated/type-graphql";

export const createCollectionsLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Collection[]>(async (eventIds) => {
    const collections = await prisma.collection.findMany({
      where: { events: { some: { eventId: { in: [...eventIds] } } } },
      include: {
        events: true,
      },
    });

    return eventIds.reduce<Collection[][]>((carry, eventId) => {
      carry = [
        ...carry,
        collections.filter(
          (c) => c.events.findIndex((e) => e.eventId === eventId) > -1
        ),
      ];
      return carry;
    }, []);
  });
