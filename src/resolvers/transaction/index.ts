import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";
import { Transaction, TransactionItem, User } from "@generated/type-graphql";
import { TransactionService } from "./transaction.service";
import { PaginationArgs } from "../shared.input";
import { PaginatedTransactionList } from "./transaction.object";
import { MyContext } from "src/types";

@Service()
@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @FieldResolver(() => User, { nullable: true })
  async user(
    @Root() transaction: Transaction,
    @Ctx() { userLoader }: MyContext
  ): Promise<User | null> {
    return userLoader.load(transaction.userId);
  }

  @FieldResolver(() => [TransactionItem])
  async items(
    @Root() transaction: Transaction,
    @Ctx() { transactionItemsLoader }: MyContext
  ): Promise<TransactionItem[]> {
    return transactionItemsLoader.load(transaction.id);
  }

  @Query(() => PaginatedTransactionList, { nullable: true })
  async fetchTransactionList(
    @Args(() => PaginationArgs) args: PaginationArgs
  ): Promise<PaginatedTransactionList | null> {
    return this.transactionService.fetch({ ...args });
  }

  @Query(() => Transaction, { nullable: true })
  fetchTransaction(
    @Arg("transactionId") transactionId: string
  ): Promise<Transaction | null> {
    return this.transactionService.findOne({ id: transactionId });
  }
}
