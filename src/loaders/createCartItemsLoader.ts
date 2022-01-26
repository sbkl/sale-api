import { PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
import { CartItem } from "@generated/type-graphql";

export const createCartItemsLoader = (prisma: PrismaClient) =>
  new DataLoader<string, CartItem[]>(async (cartIds) => {
    const articles = await prisma.cartItem.findMany({
      where: { cartId: { in: [...cartIds] } },
    });

    const cartItemsByCartId = articles.reduce<Record<string, CartItem[]>>(
      (carry, item) => {
        carry[item.cartId] = [...(carry[item.cartId] || []), item];
        return carry;
      },
      {}
    );

    return cartIds.map((id) => cartItemsByCartId[id] || []);
  });
