import { Args, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Article, Material, Mediable, Price } from "@generated/type-graphql";
import { MaterialService } from "./material.service";
import { PaginatedMaterials } from "./material.object";
import { MyContext } from "../../types";
import { MaterialPaginationArgs } from "./material.input";

@Service()
@Resolver(() => Material)
export class MaterialResolver {
  constructor(private readonly materialService: MaterialService) {}

  @FieldResolver(() => [Price])
  async prices(
    @Root() material: Material,
    @Ctx() { pricesLoader }: MyContext
  ): Promise<Price[]> {
    return pricesLoader.load(material.id);
  }

  @FieldResolver(() => [Mediable])
  async mediables(
    @Root() material: Material,
    @Ctx() { mediableLoader }: MyContext
  ): Promise<Mediable[]> {
    return mediableLoader.load(material);
  }

  @FieldResolver(() => [Article])
  async articles(
    @Root() material: Material,
    @Ctx() { articlesLoader }: MyContext
  ): Promise<Article[]> {
    return articlesLoader.load(material.id);
  }

  @Query(() => PaginatedMaterials, { nullable: true })
  async fetchMaterials(
    @Args(() => MaterialPaginationArgs) args: MaterialPaginationArgs
  ): Promise<PaginatedMaterials | null> {
    return this.materialService.fetch({ ...args });
  }
}
