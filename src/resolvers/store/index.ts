import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Market, Store } from "@generated/type-graphql";
import { MyContext } from "src/types";

@Service()
@Resolver(() => Store)
export class StoreResolver {
  @FieldResolver(() => Market, { nullable: true })
  async market(
    @Root() store: Store,
    @Ctx() { marketLoader }: MyContext
  ): Promise<Market | null> {
    return marketLoader.load(store.marketId);
  }
}
