import { Field, Int, ObjectType } from "type-graphql";
import { Cart, User, TransactionItem } from "@generated/type-graphql";

@ObjectType()
export class Session {
  @Field(() => String, { nullable: true })
  id: string | null;
  @Field(() => User, { nullable: true })
  user: User | null;
  @Field(() => String, { nullable: true })
  error: string | null;
  @Field(() => Cart, { nullable: true })
  cart?: Cart | null;
  @Field(() => Int, { nullable: true })
  quotaPurchased?: number | null;
  @Field(() => [TransactionItem], { nullable: true })
  transactionItems?: TransactionItem[];
}

@ObjectType()
export class RequestPasswordResponse {
  @Field(() => String, { nullable: true })
  token?: string | null;
  @Field(() => String, { nullable: true })
  error: string | null;
}

@ObjectType()
export class LoginResponse {
  @Field(() => Session)
  session: Session;
}
