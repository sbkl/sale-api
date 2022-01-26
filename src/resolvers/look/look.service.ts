import { MyContext } from "src/types";
import { Inject, Service } from "typedi";
import { Look } from "@generated/type-graphql";

@Service()
export class LookService {
  @Inject("context")
  private readonly context: MyContext;

  async fetchBy({ id }: { id?: string }): Promise<Look | null> {
    const { prisma } = this.context;
    if (id) {
      return prisma.look.findFirst({ where: { id } });
    }
    return null;
  }
}
