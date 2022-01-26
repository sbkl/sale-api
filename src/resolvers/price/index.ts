import { Resolver } from "type-graphql";
import { Service } from "typedi";
import { Price } from "@generated/type-graphql";

@Service()
@Resolver(() => Price)
export class PriceResolver {}
