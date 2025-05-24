import { Router } from "express";
import {
    listOrders,
    checkout,
    placeOrder,
    cancelOrder,
    applyPromo,
    removePromo,
} from "./order.controller";

const orderRouter = Router();

orderRouter.get("/", listOrders);
orderRouter.post("/checkout", checkout);
orderRouter.post("/:orderId", placeOrder);
orderRouter.post("/:orderId/cancel", cancelOrder);
orderRouter.post("/:orderId/promo", applyPromo);
orderRouter.delete("/:orderId/promo", removePromo);

export default orderRouter;
