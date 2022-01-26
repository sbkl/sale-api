import {
  Args,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";
import { Cart, CartItem } from "@generated/type-graphql";
import { CartService } from "./cart.service";
import {
  CartUpdateResponse,
  ConfirmCartTransactionResponse,
} from "./cart.object";
import {
  AddToCartInput,
  RemoveFromCartInput,
  UpdateCartItemInput,
} from "./cart.input";
import { MyContext } from "src/types";
import { Session } from "../user/user.object";

@Service()
@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @FieldResolver(() => [CartItem])
  async items(
    @Root() cart: Cart,
    @Ctx() { cartItemsLoader }: MyContext
  ): Promise<CartItem[]> {
    return cartItemsLoader.load(cart.id) || [];
  }

  @FieldResolver(() => Int)
  async totalQuantities(@Root() cart: Cart): Promise<number> {
    return this.cartService.total({ cartId: cart.id });
  }

  @Mutation(() => CartUpdateResponse)
  async addToCart(
    @Args(() => AddToCartInput) args: AddToCartInput
  ): Promise<CartUpdateResponse> {
    return this.cartService.addToCart({ ...args });
  }

  @Mutation(() => CartUpdateResponse)
  async updateCartItem(
    @Args(() => UpdateCartItemInput) args: UpdateCartItemInput
  ): Promise<CartUpdateResponse> {
    return this.cartService.updateCartItem({ ...args });
  }

  @Mutation(() => CartUpdateResponse)
  async removeFromCart(
    @Args(() => RemoveFromCartInput) args: RemoveFromCartInput
  ): Promise<CartUpdateResponse> {
    return this.cartService.removeFromCart({ ...args });
  }

  @Mutation(() => ConfirmCartTransactionResponse)
  async confirmCartTransaction(): Promise<ConfirmCartTransactionResponse> {
    return this.cartService.confirmCartTransaction();
  }
}
