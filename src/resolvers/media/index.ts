import { Material, Media } from "@generated/type-graphql";
import { MyContext } from "src/types";
import { Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { MediaService } from "./media.service";

@Service()
@Resolver(() => Media)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @FieldResolver(() => Material, { nullable: true })
  async material(
    @Root() media: Media,
    @Ctx() { materialLoader }: MyContext
  ): Promise<Material | null> {
    return materialLoader.load(media) as unknown as Material | null;
  }

  @Query(() => [Media])
  async fetchMedias(): Promise<Media[]> {
    return this.mediaService.fetch();
  }
}
