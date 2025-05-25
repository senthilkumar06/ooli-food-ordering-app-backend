import { NextFunction, Request, Response } from "express";
import { CustomError } from "./custom-error.util";

export const errorHandler = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): Promise<void> => {
    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({ error: message });
    return;
};
