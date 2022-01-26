import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Media, Mediable } from "@generated/type-graphql";
import { MyContext } from "src/types";

@Service()
@Resolver(() => Mediable)
export class MediableResolver {
  @FieldResolver(() => Media, { nullable: true })
  async media(
    @Root() mediable: Mediable,
    @Ctx() { mediaLoader }: MyContext
  ): Promise<Media | null> {
    return mediaLoader.load(mediable.mediaId);
  }
}
