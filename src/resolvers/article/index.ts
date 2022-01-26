import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Article, Material } from "@generated/type-graphql";
import { MyContext } from "src/types";

@Service()
@Resolver(() => Article)
export class ArticleResolver {
  @FieldResolver(() => Material)
  async material(
    @Root() article: Article,
    @Ctx() { materialLoader }: MyContext
  ): Promise<Material | null> {
    return materialLoader.load(article) as Promise<Material | null>;
  }
}
