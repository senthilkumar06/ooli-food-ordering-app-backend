import { Router } from "express";
import productRouter from "./modules/products/product.routes";
import orderRouter from "./modules/orders/order.routes";
import kartRouter from "./modules/kart/kart.routes";

const router = Router();

router.use("/products", productRouter);
router.use("/order", orderRouter);
router.use("/kart", kartRouter);

export default router;
