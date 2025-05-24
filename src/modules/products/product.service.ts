import { ProductModel } from "@/database/models/product.model";
import { CustomError } from "@/utils/custom-error.util";
import { decodeNextToken, encodeNextToken } from "@/utils/nextToken.util";
import { Op, Order } from "sequelize";

export const listProductsService = async (
    limit: number,
    sort?: string,
    nextToken?: string,
) => {
    let where = {};
    if (nextToken) {
        const decoded = decodeNextToken(nextToken);

        if (!decoded || typeof decoded.lastId === "undefined") {
            throw new CustomError("Invalid Next token", 400);
        }

        if (sort) {
            // When sorted, require lastPrice and lastId
            if (typeof decoded.lastPrice === "undefined") {
                throw new CustomError(
                    "Invalid Next token for sorted query",
                    400,
                );
            }
            if (sort === "ASC") {
                where = {
                    [Op.or]: [
                        { price: { [Op.gt]: decoded.lastPrice } },
                        {
                            price: decoded.lastPrice,
                            id: { [Op.gt]: decoded.lastId },
                        },
                    ],
                };
            } else {
                where = {
                    [Op.or]: [
                        { price: { [Op.lt]: decoded.lastPrice } },
                        {
                            price: decoded.lastPrice,
                            id: { [Op.lt]: decoded.lastId },
                        },
                    ],
                };
            }
        } else {
            // When not sorted, paginate only by id
            where = {
                id: {
                    [Op.gt]: decoded.lastId,
                },
            };
        }
    }

    try {
        const order: Order = [["id", "ASC"]];
        if (sort) {
            order.unshift(["price", sort]);
        }
        const products = await ProductModel.findAll({
            where,
            order,
            limit,
            attributes: { exclude: ["description"] }, // exclude description
        });

        // Prepare nextToken for the last product in this batch
        let newNextToken = null;
        if (products.length === limit) {
            const lastProduct = products[products.length - 1];
            newNextToken = encodeNextToken({
                lastPrice: lastProduct.price,
                lastId: lastProduct.id,
            });
        }
        return { products, newNextToken };
    } catch (error) {
        console.error("Error fetching products:", error);
        new CustomError(error.message, 500);
    }
};

export const getProductById = async (id: number) => {
    try {
        const product = await ProductModel.findByPk(id);
        if (!product) {
            throw new CustomError("Product not found", 404);
        }
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw new CustomError("Internal server error", 500);
    }
};
