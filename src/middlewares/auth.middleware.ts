import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { path } = req;
    if (
        path.startsWith("/api-docs") ||
        path.startsWith("/transaction") ||
        path.startsWith("/poll")
    ) {
        return next();
    }

    try {
        const authHeader = req.header("profile_id");
        if (!authHeader) {
            res.status(401).json({ error: "Missing authorization header" });
            return;
        }
        if (path.startsWith("/admin")) {
            if (authHeader === "admin") return next();
            console.log("Not an admin");
            res.status(403).json({ error: "Forbidden: admin only" });
            return;
        }
        if (!parseInt(authHeader)) {
            res.status(403).json({ error: "Forbidden: Invalid Profile Id" });
            return;
        }
        next();
    } catch (error) {
        next(error);
        return;
    }
};
