import { ArgsType, Field, Int, registerEnumType } from "type-graphql";

@ArgsType()
export class PaginationArgs {
  @Field(() => Int)
  limit: number;
  @Field(() => String, { nullable: true })
  cursor: string | null;
  @Field(() => String, { nullable: true })
  search?: string | null;
}

export enum PlantType {
  Office = "Office",
  Market = "Market",
  Store = "Store",
  Region = "Region",
}

registerEnumType(PlantType, {
  name: "PlantType",
  description: "Plant types",
});
