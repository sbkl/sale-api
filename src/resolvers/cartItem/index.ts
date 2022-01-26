import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Article, CartItem, Look } from "@generated/type-graphql";
import { MyContext } from "src/types";

@Service()
@Resolver(() => CartItem)
export class CartItemResolver {
  @FieldResolver(() => Article)
  async article(
    @Root() cartItem: CartItem,
    @Ctx() { articleLoader }: MyContext
  ) {
    return articleLoader.load(cartItem.articleId);
  }
  @FieldResolver(() => Look, { nullable: true })
  async look(
    @Root() cartItem: CartItem,
    @Ctx() { lookLoader }: MyContext
  ): Promise<Look | null> {
    return lookLoader.load(cartItem.articleId);
  }
}
