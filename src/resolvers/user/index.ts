import { Store, User } from "@generated/type-graphql";
import { MyContext } from "src/types";
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";
import { LoginInput } from "./user.input";
import { LoginResponse, RequestPasswordResponse, Session } from "./user.object";
import { UserService } from "./user.service";

@Service()
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @FieldResolver(() => Store, { nullable: true })
  async store(
    @Root() user: User,
    @Ctx() { storeLoader }: MyContext
  ): Promise<Store | null> {
    if (!user.plantId) return null;
    return storeLoader.load(user.plantId);
  }

  @Mutation(() => RequestPasswordResponse)
  async requestPassword(
    @Arg("email") email: string
  ): Promise<RequestPasswordResponse> {
    try {
      return this.userService.sendPassword({ email });
    } catch (e) {
      return {
        error: "Something went wrong. Is your connection open?",
      };
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args(() => LoginInput) args: LoginInput
  ): Promise<LoginResponse> {
    return await this.userService.login({ ...args });
  }

  @Mutation(() => Boolean)
  logout(): Promise<boolean> {
    return this.userService.logout();
  }

  @Query(() => Session, { nullable: true })
  async session(): Promise<Session> {
    return await this.userService.session();
  }
}
