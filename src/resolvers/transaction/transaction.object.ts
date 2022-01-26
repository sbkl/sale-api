import { Field, Int, ObjectType } from "type-graphql";
import { Transaction } from "@generated/type-graphql";

@ObjectType()
export class PaginatedTransactionList {
  @Field(() => [Transaction])
  data: Transaction[];
  @Field()
  hasMore: boolean;
}

@ObjectType()
export class TransactionTotal {
  @Field()
  id: string;
  @Field(() => Int, { nullable: true })
  units: number | null;
  @Field(() => Int, { nullable: true })
  amount: number | null;
}
