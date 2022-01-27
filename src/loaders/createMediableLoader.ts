import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { Collection, Look, Material, Mediable } from "@generated/type-graphql";
import { MediableType } from "../resolvers/mediable/mediable.input";

export const createMediableLoader = (prisma: PrismaClient) =>
  new DataLoader<Collection | Look | Material, Mediable[]>(async (models) => {
    const ids = models.map((m) => m.id);

    const mediableType = isMaterial(models[0])
      ? MediableType.Material
      : isCollection(models[0])
      ? MediableType.Collection
      : isLook(models[0])
      ? MediableType.Look
      : null;

    if (!mediableType) return [];
    const mediables = await prisma.mediable.findMany({
      where: { mediableId: { in: ids }, mediableType },
      orderBy: { sort: "asc" },
    });

    const modelIdsToMediables = mediables.reduce<Record<string, Mediable[]>>(
      (carry, item) => {
        if (!carry[item.mediableId]) {
          carry[item.mediableId] = [item];
        } else {
          carry[item.mediableId].push(item);
        }
        return carry;
      },
      {}
    );

    return models.map((model) => modelIdsToMediables[model.id] || []);
  });

function isCollection(collection?: any): collection is Collection {
  if (!collection) return false;
  return (collection as Collection).collectionName != undefined;
}
function isLook(look?: any): look is Look {
  if (!look) return false;
  return (look as Look).lookName != undefined;
}
function isMaterial(material?: any): material is Material {
  if (!material) return false;
  return (material as Material).level2 != undefined;
}
