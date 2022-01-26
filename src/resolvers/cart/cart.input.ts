import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class AddToCartInput {
  @Field()
  lookId: string;
  @Field()
  articleId: string;
  @Field()
  quantity: number;
}

@ArgsType()
export class UpdateCartItemInput {
  @Field()
  lookId: string;
  @Field()
  cartItemId: string;
  @Field()
  quantity: number;
}

@ArgsType()
export class RemoveFromCartInput {
  @Field()
  lookId: string;
  @Field()
  cartItemId: string;
}
