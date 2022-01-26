declare namespace NodeJS {
  interface ProcessEnv {
    APP_NAME: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    CORS_ORIGIN: string;
    COOKIE_DOMAIN: string;
    MAIL_PORT: string;
    SESSION_COOKIE_SECRET: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USER: string;
    MAIL_PASSWORD: string;
    MAIL_FROM: string;
  }
}