import { Field, ObjectType } from "type-graphql";
import { Material } from "@generated/type-graphql";

@ObjectType()
export class PaginatedMaterials {
  @Field(() => [Material])
  data: Material[];
  @Field()
  hasMore: boolean;
}
