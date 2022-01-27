import { Prisma } from "@prisma/client";
import { MyContext } from "src/types";
import { Inject, Service } from "typedi";
import {
  AddToCartInput,
  RemoveFromCartInput,
  UpdateCartItemInput,
} from "./cart.input";
import {
  CartUpdateResponse,
  ConfirmCartTransactionResponse,
} from "./cart.object";

@Service()
export class CartService {
  @Inject("context")
  private readonly context: MyContext;

  async addToCart({
    lookId,
    articleId,
    quantity,
  }: AddToCartInput): Promise<CartUpdateResponse> {
    const { prisma, req } = this.context;

    const cart = await prisma.cart.upsert({
      where: {
        userId: req.session.userId,
      },
      create: {
        userId: req.session.userId,
      },
      update: {
        userId: req.session.userId,
      },
    });

    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        stock: {
          gt: 0,
        },
      },
    });

    const look = await prisma.look.findFirst({
      where: {
        id: lookId,
      },
    });

    if (!article) {
      return {
        cart,
        look,
        error: "No stock available",
      };
    }

    const quotaPurchased =
      (
        await prisma.transaction.aggregate({
          _sum: {
            units: true,
          },
        })
      )._sum.units || 0;

    if (quotaPurchased >= 2) {
      return {
        cart,
        look,
        error: "You have reached your quota of 2 units",
      };
    }
    await prisma.cartItem.upsert({
      where: {
        cartId_articleId: {
          cartId: cart.id,
          articleId: article.id,
        },
      },
      create: {
        cartId: cart.id,
        articleId,
        quantity,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
    });

    return {
      cart,
      look,
    };
  }

  async updateCartItem({
    cartItemId,
    lookId,
    quantity,
  }: UpdateCartItemInput): Promise<CartUpdateResponse> {
    const { prisma, req } = this.context;
    const cart = await prisma.cart.findFirst({
      where: {
        userId: req.session.userId,
      },
    });
    if (!cart)
      return {
        error: "User has no cart",
      };

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });
    if (!cartItem)
      return {
        error: "User cannot update this cart",
      };

    const article = await prisma.article.findFirst({
      where: {
        id: cartItem.articleId,
        stock: {
          gte: quantity,
        },
      },
    });
    const look = await prisma.look.findFirst({
      where: {
        id: lookId,
      },
    });

    if (!article) {
      return {
        cart,
        look,
        error: "Not enough stock available",
      };
    }

    const quotaPurchased =
      (
        await prisma.transaction.aggregate({
          _sum: {
            units: true,
          },
        })
      )._sum.units || 0;

    if (quotaPurchased >= 2 && quantity > cartItem.quantity) {
      return {
        cart,
        look,
        error: "You have reached your quota of 2 units",
      };
    }

    await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity,
      },
    });

    return {
      cart,
      look,
    };
  }

  async removeFromCart({
    cartItemId,
    lookId,
  }: RemoveFromCartInput): Promise<CartUpdateResponse> {
    const { prisma, req } = this.context;
    const cart = await prisma.cart.findFirst({
      where: { userId: req.session.userId },
      include: {
        items: {
          include: {
            article: true,
          },
        },
      },
    });
    if (cart) {
      const cartItem = cart.items.find((i) => i.cartId === cart.id);
      if (cartItem?.cartId === cart.id) {
        await prisma.cartItem.delete({
          where: {
            id: cartItemId,
          },
        });
        const look = await prisma.look.findFirst({
          where: {
            id: lookId,
          },
        });
        return {
          cart,
          look,
        };
      }
    }

    return {
      error: "Something went wrong",
    };
  }

  async total({ cartId }: { cartId: string }) {
    const { prisma } = this.context;
    return (
      (
        await prisma.cartItem.aggregate({
          where: { cartId },
          _sum: {
            quantity: true,
          },
        })
      )._sum.quantity || 0
    );
  }

  async confirmCartTransaction(): Promise<ConfirmCartTransactionResponse> {
    const { prisma, req } = this.context;
    const user = await prisma.user.findFirst({
      where: { id: req.session.userId },
    });

    const cart = await prisma.cart.findFirst({
      where: {
        userId: req.session.userId,
      },
      include: {
        items: true,
      },
    });

    if (!cart)
      return {
        session: {
          id: "Current",
          user,
          error: "No cart found",
        },
      };
    const initialCartItems = [...cart.items];

    const articlesWithStock = await prisma.article.findMany({
      where: {
        id: { in: [...cart.items.map((i) => i.articleId)] },
        stock: {
          gt: 0,
        },
      },
    });

    const updateStockData = articlesWithStock.reduce<
      {
        where: Prisma.ArticleWhereUniqueInput;
        data: Prisma.ArticleUpdateInput;
      }[]
    >((carry, item) => {
      const quantity =
        cart.items.find((i) => i.articleId === item.id)?.quantity || 0;
      if (quantity) {
        carry = [
          ...carry,
          {
            where: { id: item.id },
            data: {
              stock: {
                decrement: item.stock >= quantity ? quantity : item.stock,
              },
            },
          },
        ];
      }
      return carry;
    }, []);

    const materials = await prisma.material.findMany({
      where: {
        id: { in: articlesWithStock.map((i) => i.materialId) },
      },
      include: {
        articles: true,
        prices: true,
      },
    });

    if (!user || !user.plantId) {
      return {
        session: {
          id: "Current",
          user,
          error: "No cart found",
        },
      };
    }

    const store = await prisma.store.findFirst({
      where: {
        id: user.plantId,
      },
    });

    if (!store) {
      return {
        session: {
          id: "Current",
          user,
          error: "No cart found",
        },
      };
    }

    const userCurrency = (
      await prisma.market.findFirst({
        where: { id: store.marketId },
      })
    )?.currency;

    if (!userCurrency) {
      return {
        session: {
          id: "Current",
          user,
          error: "No cart found",
        },
      };
    }

    const [units, amount] = cart.items.reduce<[number, number]>(
      (carry, item) => {
        const article = articlesWithStock.find((a) => a.id === item.articleId);
        if (article) {
          const material = materials.find((m) => m.id === article.materialId);
          if (material) {
            const price = material.prices.find(
              (p) => p.currency === userCurrency
            )?.value;
            if (price) {
              carry[0] =
                carry[0] +
                (article.stock >= item.quantity
                  ? item.quantity
                  : article.stock);
              carry[1] =
                carry[1] +
                (article.stock >= item.quantity
                  ? item.quantity
                  : article.stock) *
                  price *
                  0.2;
            }
          }
        }
        return carry;
      },
      [0, 0]
    );

    const updateStock = updateStockData.map(async (update) => {
      return await prisma.article.update({ ...update });
    });

    await Promise.all(updateStock);

    const id = (await this.nextOrderNumber())[0];

    if (articlesWithStock.length > 0) {
      await prisma.transaction.create({
        data: {
          id,
          userId: req.session.userId,
          units,
          amount,
          createdById: req.session.userId,
          currency: userCurrency,
        },
      });
    }

    const createTransactionItems = updateStockData.map(async (article) => {
      const material = materials.find((m) =>
        m.articles.map((a) => a.id).includes(article.where.id || "unknown")
      );
      if (material) {
        const price = material.prices.find(
          (p) => p.currency === userCurrency
        )?.value;
        if (price && article.where.id) {
          return await prisma.transactionItem.create({
            data: {
              articleId: article.where.id,
              transactionId: id,
              price: price * 0.2,
              // @ts-ignore
              amount: price * article.data.stock?.decrement * 0.2,
              // @ts-ignore
              units: article.data.stock?.decrement,
              currency: userCurrency,
            },
          });
        }
        return null;
      }
      return null;
    });

    await Promise.all(createTransactionItems);

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    const transactionItems = await prisma.transactionItem.findMany({
      where: {
        transaction: {
          userId: user.id,
        },
      },
    });
    const missingItemsWithNoStock = initialCartItems.filter((i) => {
      return !articlesWithStock.map((a) => a.id).includes(i.articleId);
    });

    const itemsWithLessStock = initialCartItems
      .filter((i) => {
        return articlesWithStock.map((a) => a.id).includes(i.articleId);
      })
      .map((item) => {
        const article = articlesWithStock.find((a) => a.id === item.articleId);
        if (!article) {
          return item;
        }
        return {
          ...item,
          quantity:
            item.quantity > article.stock ? item.quantity - article.stock : 0,
        };
      })
      .filter((i) => i.quantity > 0);

    return {
      session: {
        id: "Current",
        user,
        cart,
        quotaPurchased: units,
        transactionItems,
        error: null,
      },
      missingItems: [...missingItemsWithNoStock, ...itemsWithLessStock],
    };
  }

  async nextOrderNumber(count = 1): Promise<string[]> {
    const lastOrderNumber =
      (
        await this.context.prisma.transaction.findFirst({
          orderBy: { id: "desc" },
        })
      )?.id || null;

    const date = new Date();
    const year = String(date.getFullYear()).substring(2, 4);
    const monthNumber = String(date.getMonth() + 1);
    const monthValue =
      monthNumber.length === 1 ? "0" + monthNumber : monthNumber;
    const currentPeriod = year + monthValue;
    const lastPeriod = lastOrderNumber?.substring(0, 4);
    const ids = [...Array(count).keys()].map((key) => {
      return (
        currentPeriod +
        (
          "00000" +
          (lastOrderNumber && currentPeriod === lastPeriod
            ? parseInt(lastOrderNumber.substring(4, 10)) + (key + 1)
            : key + 1)
        ).slice(-6)
      );
    });

    return ids;
  }
}
