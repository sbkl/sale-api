import { Resolver } from "type-graphql";
import { Service } from "typedi";
import { Region } from "@generated/type-graphql";

@Service()
@Resolver(() => Region)
export class RegionResolver {}
