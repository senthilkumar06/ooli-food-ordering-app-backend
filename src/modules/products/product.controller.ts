import { Request, Response, NextFunction } from "express";
import { getProductById, listProductsService } from "./product.service";

export const listProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit?.toString(), 10) || 10;
        let sort: string;
        if (req.query.sort === "desc") {
            sort = "DESC";
        } else if (req.query.sort === "asc") {
            sort = "ASC";
        }
        const nextToken = req.query.nextToken?.toString();
        const response = await listProductsService(limit, sort, nextToken);
        res.status(200).json(response);
    } catch (err) {
        console.error("Error at <productController.listProducts>", err.message);
        next(err);
    }
};

export const getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = parseInt(req.params.productId);
        const product = await getProductById(id);
        res.status(200).json(product);
    } catch (err) {
        console.error("Error at <productController.getProduct>", err.message);
        next(err);
    }
};
