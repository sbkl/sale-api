import argon2 from "argon2";
import { Inject, Service } from "typedi";
import { v4 } from "uuid";
import {
  COOKIE_NAME,
  PASSWORD_REQUEST_PREFIX,
  __prod__,
} from "../../constants";

import { MyContext } from "../../types";
import { LoginResponse, RequestPasswordResponse, Session } from "./user.object";
import { User } from "@generated/type-graphql";
import { PasswordRequestEmail } from "../../mail/PasswordRequestEmail";
import { LoginInput } from "./user.input";

@Service()
export class UserService {
  @Inject("context")
  private readonly context: MyContext;

  async session(): Promise<Session> {
    const { prisma, req } = this.context;
    if (!req.session.userId) {
      return {
        id: "Current",
        user: null,
        error: "Not authenticated",
      };
    }
    const user = await prisma.user.findFirst({
      where: { id: req.session.userId },
    });

    if (!user) {
      await this.logout();
      return {
        id: "Current",
        user: null,
        error: "Not authenticated",
      };
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    });

    const quotaPurchased =
      (
        await prisma.transaction.aggregate({
          where: {
            userId: user.id,
          },
          _sum: {
            units: true,
          },
        })
      )._sum.units || 0;

    const transactionItems = await prisma.transactionItem.findMany({
      where: {
        transaction: {
          userId: user.id,
        },
      },
    });

    return {
      id: "Current",
      user,
      cart,
      quotaPurchased,
      transactionItems,
      error: null,
    };
  }

  async findOneBy({
    id,
    email,
  }: {
    id?: string;
    email?: string;
  }): Promise<User | null> {
    const { prisma } = this.context;
    if (id) {
      return await prisma.user.findFirst({
        where: { id },
      });
    }
    if (email) {
      return await prisma.user.findFirst({
        where: { email },
      });
    }
    return null;
  }

  async sendPassword({
    email,
  }: {
    email: string;
  }): Promise<RequestPasswordResponse> {
    const { prisma } = this.context;
    if (!email) {
      return {
        error: "The email field is required",
        token: "",
      };
    }

    let isValidEmail = false;

    const test = email.split("@");

    if (test.length === 2 && test[1].toLowerCase() === "burberry.com") {
      isValidEmail = true;
    }

    if (!isValidEmail) {
      return {
        error: "The email is not valid",
        token: "",
      };
    }
    try {
      const initialPassword = Math.random().toString().substring(2, 8);

      const password = await argon2.hash(initialPassword);

      let user = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (!user)
        return {
          token: "",
          error: "Not account found.",
        };

      await prisma.user.update({
        where: {
          email: email.toLowerCase(),
        },
        data: {
          password,
        },
      });

      const { redis } = this.context;

      if (!user)
        return {
          token: "",
          error: "Not authenticated",
        };

      const token = v4();

      await redis.set(
        PASSWORD_REQUEST_PREFIX + token,
        user.id,
        "ex",
        1000 * 60 * 60 * 24 * 3
      ); // 3 days

      await new PasswordRequestEmail({
        to: user.email,
        code: initialPassword,
      }).send();
      return { token, error: null };
    } catch (e) {
      console.log(e);
      return {
        token: "",
        error: JSON.stringify(e, null, -2),
      };
    }
  }

  async login({ token, password }: LoginInput): Promise<LoginResponse> {
    const { redis, req, prisma } = this.context;
    const key = PASSWORD_REQUEST_PREFIX + token;
    const userId = await redis.get(key);
    await redis.del(key);

    if (!userId)
      return {
        session: {
          id: "Current",
          user: null,
          error: "Token expired",
        },
      };

    const user = await this.findOneBy({ id: userId });

    if (!user)
      return {
        session: {
          id: "Current",
          user: null,
          error: "User not found",
        },
      };

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        session: {
          id: "Current",
          user: null,
          error: "Code not valid",
        },
      };
    }

    req.session.userId = user.id;

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

    const quotaPurchased =
      (
        await prisma.transaction.aggregate({
          where: {
            userId: user.id,
          },
          _sum: {
            units: true,
          },
        })
      )._sum.units || 0;

    const transactionItems = await prisma.transactionItem.findMany({
      where: {
        transaction: {
          userId: user.id,
        },
      },
    });
    return {
      session: {
        id: "Current",
        user,
        cart,
        quotaPurchased,
        transactionItems,
        error: null,
      },
    };
  }

  logout(): Promise<boolean> {
    const { req, res } = this.context;
    return new Promise((resolve) => {
      if (req.session.userId === undefined) {
        return resolve(true);
      }
      return req.session.destroy((err) => {
        if (__prod__) {
          res.clearCookie(COOKIE_NAME, {
            domain: process.env.COOKIE_DOMAIN,
            path: "/",
          });
        } else {
          res.clearCookie(COOKIE_NAME);
        }
        if (err) {
          console.log("err", err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }
}
