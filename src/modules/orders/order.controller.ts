import { Request, Response, NextFunction } from "express";

export const checkout = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        res.status(200).json({});
    } catch (err) {
        console.error("Error at <orderController.checkout>", err.message);
        next(err);
    }
};

export const placeOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        res.status(200).json({});
    } catch (err) {
        console.error("Error at <orderController.placeOrder>", err.message);
        next(err);
    }
};

export const applyPromo = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        res.status(200).json({});
    } catch (err) {
        console.error("Error at <orderController.applyPromo>", err.message);
        next(err);
    }
};

export const removePromo = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        res.status(200).json({});
    } catch (err) {
        console.error("Error at <orderController.removePromo>", err.message);
        next(err);
    }
};

export const cancelOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        res.status(200).json({});
    } catch (err) {
        console.error("Error at <orderController.cancelOrder>", err.message);
        next(err);
    }
};

export const listOrders = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        res.status(200).json({});
    } catch (err) {
        console.error("Error at <orderController.cancelOrder>", err.message);
        next(err);
    }
};
