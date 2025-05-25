import { Request, Response, NextFunction } from "express";
import {
    fetchOrders,
    checkoutService,
    placeOrderService,
    cancelOrderService,
    applyPromoService,
    removePromoService,
} from "./order.service";
import { IApplyPromo, ICheckoutRequest } from "@/interfaces/request.interface";

export const checkout = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const orderRequest: ICheckoutRequest = req.body;
        const response = await checkoutService(orderRequest);
        res.status(200).json(response);
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
        const draftOrderId = req.params.orderId;
        const response = await placeOrderService(draftOrderId);
        res.status(200).json(response);
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
        const request: IApplyPromo = req.body;
        const orderId: string = req.params.orderId;
        const response = await applyPromoService(orderId, request.code);
        res.status(200).json(response);
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
        const request: IApplyPromo = req.body;
        const orderId: string = req.params.orderId;
        const response = await removePromoService(orderId, request.code);
        res.status(200).json(response);
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
        const orderId: string = req.params.orderId;
        const response = await cancelOrderService(orderId);
        res.status(200).json(response);
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
        const response = await fetchOrders();
        res.status(200).json(response);
    } catch (err) {
        console.error("Error at <orderController.cancelOrder>", err.message);
        next(err);
    }
};
