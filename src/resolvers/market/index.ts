import { Resolver } from "type-graphql";
import { Service } from "typedi";
import { Market } from "@generated/type-graphql";

@Service()
@Resolver(() => Market)
export class MarketResolver {}
