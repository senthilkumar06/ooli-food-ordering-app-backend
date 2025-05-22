import express from "express";
import { envs } from "./config";
import cors from "cors";
import router from "./routes";
import { errorHandler } from "./utils/error-handler.util";
import { initDB } from "./database/db.config";
import { authMiddleware } from "./middlewares/auth.middleware";

const appServer = express();
const port = envs.PORT;

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
};

appServer.use(cors(corsOptions));
appServer.options("*", cors(corsOptions));

appServer.use((req, res, next) => {
    const startTime = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - startTime;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

        if (res.statusCode >= 500) {
            console.error(message);
        } else if (res.statusCode >= 400) {
            console.warn(message);
        } else {
            console.info(message);
        }
    });

    next();
});

appServer.use(express.json());
appServer.use(authMiddleware);

appServer.use("/", router);

appServer.use(errorHandler);

appServer.all("*", (req, res) => {
    res.status(404).json({ message: "Sorry! Resource not found" });
});

initDB()
    .then(() => {
        console.info("Database connected successfully!");
        appServer.listen(port, () => {
            console.info(`Server is running on PORT:${port}`);
        });
    })
    .catch(error => {
        console.error("Unable to connect to the database:", error);
    });
