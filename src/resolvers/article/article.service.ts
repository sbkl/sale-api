import { MyContext } from "src/types";
import { Inject, Service } from "typedi";
import { Article } from "@generated/type-graphql";

@Service()
export class ArticleService {
  @Inject("context")
  private readonly context: MyContext;

  async findOne({ id }: { id: string }): Promise<Article | null> {
    const { prisma } = this.context;

    const article = await prisma.article.findFirst({ where: { id } });

    if (article) {
      return article as Article;
    }
    return null;
  }
}
