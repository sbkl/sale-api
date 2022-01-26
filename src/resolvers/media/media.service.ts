import { Inject, Service } from "typedi";
import { MyContext } from "src/types";
import { Media } from "@generated/type-graphql";

@Service()
export class MediaService {
  @Inject("context")
  private readonly context: MyContext;

  async fetch(): Promise<Media[]> {
    const { prisma } = this.context;
    return prisma.media.findMany();
  }
}
