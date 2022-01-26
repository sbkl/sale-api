import { Field, ObjectType } from "type-graphql";
import { Look, Cart, CartItem, TransactionItem } from "@generated/type-graphql";
import { Session } from "../user/user.object";

@ObjectType()
export class CartUpdateResponse {
  @Field(() => Look, { nullable: true })
  look?: Look | null;
  @Field(() => Cart, { nullable: true })
  cart?: Cart | null;
  @Field(() => String, { nullable: true })
  error?: string | null;
  @Field(() => [TransactionItem], { nullable: true })
  transactionItems?: TransactionItem[];
}

@ObjectType()
export class ConfirmCartTransactionResponse {
  @Field(() => Session)
  session: Session;
  @Field(() => [CartItem])
  missingItems?: CartItem[];
}
