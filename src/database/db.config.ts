import { envs } from "../config";
import { Sequelize } from "sequelize-typescript";

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME, NODE_ENV } = envs;

const sequelize = new Sequelize(
    DB_NAME as string,
    DB_USERNAME as string,
    DB_PASSWORD,
    {
        dialect: "postgres",
        host: DB_HOST,
        port: DB_PORT,
        define: {
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
            freezeTableName: true,
        },
        pool: {
            min: 0,
            max: 5,
        },
        logging: console.log,
        logQueryParameters: NODE_ENV === "prod",
        benchmark: true,
        models: [],
    },
);

export const initDB = async () => {
    if (NODE_ENV !== "test") {
        await sequelize.authenticate();
    }
};

export const DB = {
    sequelize, // connection instance (RAW queries)
    Sequelize, // library
};
