import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Collection, Look, Material, Mediable } from "@generated/type-graphql";
import { MyContext } from "src/types";
import { LookService } from "./look.service";

@Service()
@Resolver(() => Look)
export class LookResolver {
  constructor(private readonly lookService: LookService) {}

  @FieldResolver(() => Collection, { nullable: true })
  async collection(
    @Root() look: Look,
    @Ctx() { collectionLoader }: MyContext
  ): Promise<Collection | null> {
    return collectionLoader.load(
      look.collectionId
    ) as Promise<Collection | null>;
  }

  @FieldResolver(() => [Material])
  async materials(
    @Root() look: Look,
    @Ctx() { materialLoader }: MyContext
  ): Promise<Material[]> {
    return materialLoader.load(look) as Promise<Material[]>;
  }

  @FieldResolver(() => [Mediable])
  async mediables(
    @Root() look: Look,
    @Ctx() { mediableLoader }: MyContext
  ): Promise<Mediable[]> {
    return mediableLoader.load(look);
  }

  @Query(() => Look, { nullable: true })
  async fetchLook(@Arg("id") id: string): Promise<Look | null> {
    return this.lookService.fetchBy({ id });
  }
}
