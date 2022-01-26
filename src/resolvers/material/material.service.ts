import { Prisma } from "@prisma/client";
import { MyContext } from "src/types";
import { Inject, Service } from "typedi";
import { PaginatedMaterials } from "./material.object";
import { Material } from "@generated/type-graphql";
import { MaterialPaginationArgs } from "./material.input";

@Service()
export class MaterialService {
  @Inject("context")
  private readonly context: MyContext;

  async fetch({
    limit,
    cursor,
    search,
    colour,
    fit,
    genre,
    look,
  }: MaterialPaginationArgs): Promise<PaginatedMaterials | null> {
    const {
      prisma,
      req: {
        session: { userId },
      },
    } = this.context;

    if (!userId) return null;

    const realLimit = Math.min(100, limit);

    let baseArgs: Prisma.MaterialFindManyArgs = {
      take: realLimit,
      orderBy: [{ id: "asc" }],
    };

    baseArgs = cursor
      ? {
          ...baseArgs,
          skip: 1,
          cursor: {
            id: cursor,
          },
        }
      : baseArgs;

    const whereSearch: Prisma.MaterialWhereInput = search
      ? {
          id: {
            startsWith: search,
          },
        }
      : {};
    const whereColour: Prisma.MaterialWhereInput =
      colour && colour != "ALL"
        ? {
            colour,
          }
        : {};

    const whereFit: Prisma.MaterialWhereInput =
      fit && fit != "ALL"
        ? {
            fit,
          }
        : {};
    const whereGenre: Prisma.MaterialWhereInput =
      genre && genre != "ALL"
        ? {
            level2: genre,
          }
        : {};
    const whereLook: Prisma.MaterialWhereInput =
      look && look != "ALL"
        ? {
            description: { contains: look },
          }
        : {};
    console.log("look", {
      ...whereSearch,
      ...whereColour,
      ...whereFit,
      ...whereGenre,
      ...whereLook,
    });
    baseArgs = {
      ...baseArgs,
      where: {
        ...whereSearch,
        ...whereColour,
        ...whereFit,
        ...whereGenre,
        ...whereLook,
      },
    };

    const materials = await prisma.material.findMany(baseArgs);

    return {
      data: materials.slice(0, realLimit) as unknown as Material[],
      hasMore: materials.length === realLimit,
    };
  }
}
