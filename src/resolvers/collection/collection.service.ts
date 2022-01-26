import { MyContext } from "src/types";
import { Inject, Service } from "typedi";
import { Collection } from "@generated/type-graphql";

@Service()
export class CollectionService {
  @Inject("context")
  private readonly context: MyContext;

  async fetchBy({ id }: { id?: string }): Promise<Collection | null> {
    const { prisma } = this.context;
    if (id) {
      return prisma.collection.findFirst({ where: { id } });
    }
    return null;
  }
}
