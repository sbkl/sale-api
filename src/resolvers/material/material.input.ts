import { ArgsType, Field } from "type-graphql";
import { PaginationArgs } from "../shared.input";

@ArgsType()
export class MaterialPaginationArgs extends PaginationArgs {
  @Field(() => String, { nullable: true })
  genre?: string | null;
  @Field(() => String, { nullable: true })
  look?: string | null;
  @Field(() => String, { nullable: true })
  fit?: string | null;
  @Field(() => String, { nullable: true })
  colour?: string | null;
}
