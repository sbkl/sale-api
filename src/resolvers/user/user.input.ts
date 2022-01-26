import { ArgsType, Field, registerEnumType } from "type-graphql";

export enum Role {
  Admin = "Admin",
  Unknown = "Unknown",
}

registerEnumType(Role, {
  name: "Role",
  description: "User Role list",
});

@ArgsType()
export class LoginInput {
  @Field()
  token: string;
  @Field()
  password: string;
}
