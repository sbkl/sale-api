import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Article, Look, TransactionItem } from "@generated/type-graphql";
import { MyContext } from "src/types";

@Service()
@Resolver(() => TransactionItem)
export class TransactionItemResolver {
  @FieldResolver(() => Article, { nullable: true })
  async article(
    @Root() item: TransactionItem,
    @Ctx() { articleLoader }: MyContext
  ): Promise<Article | null> {
    return articleLoader.load(item.articleId);
  }
  @FieldResolver(() => Look, { nullable: true })
  async look(
    @Root() item: TransactionItem,
    @Ctx() { lookLoader }: MyContext
  ): Promise<Look | null> {
    return lookLoader.load(item.articleId);
  }
}
