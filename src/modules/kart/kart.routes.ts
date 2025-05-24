import { Router } from "express";
import { addToCart, removeFromCart } from "./kart.controller";

const kartRouter = Router();

kartRouter.post("/add", addToCart);
kartRouter.post("/remove", removeFromCart);

export default kartRouter;
