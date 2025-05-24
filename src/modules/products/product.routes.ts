import { Router } from "express";
import { listProducts, getProduct } from "./product.controller";

const productRouter = Router();

productRouter.get("/", listProducts);
productRouter.get("/:productId", getProduct);

export default productRouter;
