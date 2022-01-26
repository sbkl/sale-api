import Bull from "bull";
export const connectQueue = (name: string) =>
  new Bull(name, process.env.REDIS_URL);
