import { MyContext } from "src/types";
import { Inject, Service } from "typedi";
import { Event } from "@generated/type-graphql";

@Service()
export class EventService {
  @Inject("context")
  private readonly context: MyContext;

  async fetch(): Promise<Event[]> {
    const { prisma } = this.context;
    return prisma.event.findMany({
      // where: {
      //   from: {
      //     lte: new Date(),
      //   },
      //   to: {
      //     gte: new Date(),
      //   },
      // },
    });
  }
}
