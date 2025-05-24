import { Request, Response, NextFunction } from "express";

export const addToCart = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        res.status(200).json({});
    } catch (err) {
        console.error("Error at <kartController.addToCart>", err.message);
        next(err);
    }
};

export const removeFromCart = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        res.status(200).json({});
    } catch (err) {
        console.error("Error at <kartController.removeFromCart>", err.message);
        next(err);
    }
};
