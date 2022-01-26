import { Service } from "typedi";
import { Collection, Event } from "@generated/type-graphql";
import { Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { EventService } from "./event.service";
import { MyContext } from "src/types";

@Service()
@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @FieldResolver(() => [Collection])
  async collections(
    @Root() event: Event,
    @Ctx() { collectionsLoader }: MyContext
  ): Promise<Collection[]> {
    return collectionsLoader.load(event.id);
  }

  @Query(() => [Event])
  async fetchActiveEvents(): Promise<Event[]> {
    return this.eventService.fetch();
  }
}
