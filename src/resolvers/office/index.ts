import { Resolver } from "type-graphql";
import { Service } from "typedi";
import { Office } from "@generated/type-graphql";

@Service()
@Resolver(() => Office)
export class OfficeResolver {}
