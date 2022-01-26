import { Prisma } from "@prisma/client";
import { MyContext } from "src/types";
import { Inject, Service } from "typedi";
import { PaginationArgs } from "../shared.input";
import {
  PaginatedTransactionList,
  TransactionTotal,
} from "./transaction.object";
import { Transaction } from "@generated/type-graphql";

@Service()
export class TransactionService {
  @Inject("context")
  private readonly context: MyContext;

  async findOne({ id }: { id: string }): Promise<Transaction | null> {
    const { prisma } = this.context;

    const transaction = await prisma.transaction.findFirst({
      where: { id },
    });

    if (transaction) {
      return transaction as Transaction;
    }
    return null;
  }

  async fetch({
    limit,
    cursor,
    search,
  }: PaginationArgs): Promise<PaginatedTransactionList | null> {
    const {
      prisma,
      req: {
        session: { userId },
      },
    } = this.context;

    if (!userId) return null;

    const realLimit = Math.min(100, limit);

    let baseArgs: Prisma.TransactionFindManyArgs = {
      take: realLimit,
      orderBy: [{ createdAt: "desc" }],
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

    const whereSearch: Prisma.TransactionWhereInput = search
      ? {
          OR: [
            {
              id: {
                contains: search,
              },
            },
            {
              user: {
                email: {
                  contains: search,
                },
              },
            },
          ],
        }
      : {};

    baseArgs = {
      ...baseArgs,
      where: {
        ...whereSearch,
      },
      include: { items: true },
    };

    const transactions = await prisma.transaction.findMany(baseArgs);

    return {
      data: transactions.slice(0, realLimit) as unknown as Transaction[],
      hasMore: transactions.length === realLimit,
    };
  }

  async nextOrderNumber(count = 1): Promise<string[]> {
    const lastOrderNumber =
      (
        await this.context.prisma.transaction.findFirst({
          orderBy: { id: "desc" },
        })
      )?.id || null;

    const date = new Date();
    const year = String(date.getFullYear()).substring(2, 4);
    const monthNumber = String(date.getMonth() + 1);
    const monthValue =
      monthNumber.length === 1 ? "0" + monthNumber : monthNumber;
    const currentPeriod = year + monthValue;
    const lastPeriod = lastOrderNumber?.substring(0, 4);
    const ids = [...Array(count).keys()].map((key) => {
      return (
        currentPeriod +
        (
          "00000" +
          (lastOrderNumber && currentPeriod === lastPeriod
            ? parseInt(lastOrderNumber.substring(4, 10)) + (key + 1)
            : key + 1)
        ).slice(-6)
      );
    });

    return ids;
  }

  async total(): Promise<TransactionTotal> {
    const { prisma } = this.context;

    const total = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
        units: true,
      },
    });

    return {
      ...total._sum,
      id: "TransactionTotal",
    };
  }
}
