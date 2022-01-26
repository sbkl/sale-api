import { MyContext } from "src/types";
import { Inject, Service } from "typedi";
import { TransactionItem } from "@generated/type-graphql";

@Service()
export class TransactionItemService {
  @Inject("context")
  private readonly context: MyContext;

  async findManyBy({
    transactionId,
  }: {
    transactionId: string;
  }): Promise<TransactionItem[]> {
    const { prisma } = this.context;

    return prisma.transactionItem.findMany({
      where: { transactionId },
    }) as unknown as Promise<TransactionItem[]>;
  }
}
