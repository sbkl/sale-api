import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Collection, Look, Mediable } from "@generated/type-graphql";
import { MyContext } from "src/types";
import { CollectionService } from "./collection.service";

@Service()
@Resolver(() => Collection)
export class CollectionResolver {
  constructor(private readonly collectionService: CollectionService) {}
  @FieldResolver(() => [Mediable])
  async mediables(
    @Root() collection: Collection,
    @Ctx() { mediableLoader }: MyContext
  ): Promise<Mediable[]> {
    return mediableLoader.load(collection);
  }

  @FieldResolver(() => [Look])
  async looks(
    @Root() collection: Collection,
    @Ctx() { looksLoader }: MyContext
  ): Promise<Look[]> {
    return looksLoader.load(collection.id);
  }

  @Query(() => Collection, { nullable: true })
  async fetchCollection(@Arg("id") id: string): Promise<Collection | null> {
    return this.collectionService.fetchBy({ id });
  }
}
