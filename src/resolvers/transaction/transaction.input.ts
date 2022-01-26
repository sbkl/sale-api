import { ArgsType, Field, InputType } from "type-graphql";

@InputType()
export class CreateTransactionItemInput {
  @Field()
  articleId: string;
  @Field()
  quantity: number;
}

@ArgsType()
export class CreateTransactionInput {
  @Field()
  items: CreateTransactionItemInput[];
}
