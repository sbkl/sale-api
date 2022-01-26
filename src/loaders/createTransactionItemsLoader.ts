import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { TransactionItem } from "@generated/type-graphql";

export const createTransactionItemsLoader = (prisma: PrismaClient) =>
  new DataLoader<string, TransactionItem[]>(async (transactionIds) => {
    const transactions = await prisma.transactionItem.findMany({
      where: { transactionId: { in: [...transactionIds] } },
    });

    return transactionIds.reduce<TransactionItem[][]>(
      (carry, transactionId) => {
        carry = [
          ...carry,
          transactions.filter((c) => c.transactionId === transactionId),
        ];
        return carry;
      },
      []
    );
  });
