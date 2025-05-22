import "dotenv/config";
import { get } from "env-var";

export const envs = {
    PORT: get("PORT").required().asPortNumber(),
    NODE_ENV: get("NODE_ENV").default("dev").asString(),
    DB_PORT: get("DB_PORT").required().asPortNumber(),
    DB_USERNAME: get("DB_USERNAME").default("dev").asString(),
    DB_PASSWORD: get("DB_PASSWORD").default("dev").asString(),
    DB_NAME: get("DB_NAME").default("dev").asString(),
    DB_HOST: get("DB_HOST").default("dev").asString(),
    DB_DIALECT: get("DB_DIALECT").default("dev").asString(),
    RESULT_API: get("RESULT_API").asString(),
    TRANSACTION_API: get("TRANSACTION_API").asString(),
    AUTH_TOKEN: get("AUTH_TOKEN").asString(),
};
