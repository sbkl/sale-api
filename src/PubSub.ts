import "dotenv/config";
import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

export const PubSub = new RedisPubSub({
  publisher: new Redis(process.env.REDIS_URL),
  subscriber: new Redis(process.env.REDIS_URL),
});
