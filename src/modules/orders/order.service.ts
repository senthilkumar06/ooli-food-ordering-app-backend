import {
    ICheckoutDraft,
    ICheckoutRequest,
    IPromoCode,
} from "@/interfaces/request.interface";
import { CustomError } from "@/utils/custom-error.util";
import { validateCheckout } from "./order.validators";
import { DB } from "@/database/db.config";
import { ProductModel } from "@/database/models/product.model";
import { QueryTypes } from "sequelize";
import {
    getKey,
    read,
    remove,
    write,
} from "@/database/repository/redis.repository";
import { generateCheckoutToken } from "@/utils/keys.util";
import { REDIS_CONSTANTS } from "@/constants/redis.constants";
import { DiscountModel } from "@/database/models/discounts.model";
import { EOrderStatus, EValueType } from "@/interfaces/types.interface";
import { OrderModel } from "@/database/models/order.model";
import { OrderDiscountsModel } from "@/database/models/order_discounts.model";
import { OrderLineItemModel } from "@/database/models/order_line_items.model";
import { v4 } from "uuid";

export const checkoutService = async (orderRequest: ICheckoutRequest) => {
    validateCheckout(orderRequest);
    const transaction = await DB.sequelize.transaction();
    try {
        const productIds = orderRequest.lineItems.map(item => item.productId);
        const products = await ProductModel.findAll({
            where: { id: productIds },
            transaction,
        });

        if (products.length !== productIds.length) {
            throw new CustomError("One or more products not found", 400);
        }
        const valuesClause = orderRequest.lineItems
            .map(item => `(${item.productId}, ${item.quantity})`)
            .join(", ");

        const query = `
      WITH items(product_id, quantity) AS (
        VALUES ${valuesClause}
      )
      SELECT SUM(p.price * i.quantity) AS subtotal
      FROM items i
      INNER JOIN food_kart_products p ON p.id = i.product_id;
    `;

        const [result] = await DB.sequelize.query<{
            subtotal: string | null;
        }>(query, { type: QueryTypes.SELECT, transaction });
        console.debug("result", result);
        const subtotalPrice = Number(result.subtotal);

        if (isNaN(subtotalPrice)) {
            throw new CustomError(
                "One or more products not found or invalid price",
                400,
            );
        }
        const checkoutToken = generateCheckoutToken();
        const checkoutDraft = {
            lineItems: orderRequest.lineItems,
            subtotalPrice,
            totalPrice: subtotalPrice,
            createdAt: new Date().toISOString(),
        };
        const checkoutKey = `${getKey("user", "")}:${getKey(
            "checkout",
            checkoutToken,
        )}`;
        await write(
            checkoutKey,
            checkoutDraft,
            REDIS_CONSTANTS.ABANDONED_CHECKOUT_TTL,
        );

        return {};
    } catch (err) {
        console.error("Error checking out:", err.message);
        await transaction.rollback();
        throw new CustomError(err.message, 500);
    }
};

export const placeOrderService = async (checkoutToken: string) => {
    const transaction = await DB.sequelize.transaction();
    try {
        const cartKey = `${getKey("user", "")}:cart`;
        const checkoutKey = `${getKey("user", "")}:${getKey(
            "checkout",
            checkoutToken,
        )}`;
        const checkout = await read<ICheckoutDraft>(checkoutKey);

        // 1. Create order
        const order = await OrderModel.create(
            {
                id: v4(),
                name: `FOOD-${Date.now()}`,
                subtotalPrice: checkout.subtotalPrice,
                totalPrice: checkout.totalPrice,
                confirmed: true,
                status: "placed",
            },
            { transaction },
        );

        // 2. Add line items
        const lineItemsPayload = checkout.lineItems.map(item => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
        }));

        await OrderLineItemModel.bulkCreate(lineItemsPayload, { transaction });

        // 3. Add discounts
        if (checkout.promoCodes && checkout.promoCodes.length > 0) {
            const discountPayload = checkout.promoCodes.map(d => ({
                orderId: order.id,
                discountId: d.id,
            }));

            await OrderDiscountsModel.bulkCreate(discountPayload, {
                transaction,
            });
        }

        // 4. Remove checkout from Redis
        await remove(checkoutKey);

        // 5. Remove cart from Redis
        await remove(cartKey);

        // Fetch full order with line items and discounts
        const placedOrder = await OrderModel.findByPk(order.id, {
            include: [OrderLineItemModel, OrderDiscountsModel],
            transaction,
        });

        await transaction.commit();

        return placedOrder;
    } catch (err) {
        console.error("Error placing order:", err.message);
        await transaction.rollback();
        throw new CustomError(err.message, 500);
    }
};

export const cancelOrderService = async (orderId: string) => {
    const transaction = await DB.sequelize.transaction();
    try {
        const order = await OrderModel.findByPk(orderId);

        if (!order) {
            throw new CustomError("Order not found", 404);
        }

        if (order.status === EOrderStatus.cancelled) {
            throw new CustomError("Order is already cancelled", 400);
        }

        await OrderModel.update(
            {
                status: EOrderStatus.cancelled,
                cancelledAt: new Date(),
            },
            {
                where: { id: orderId },
                transaction,
            },
        );

        return order;
    } catch (err) {
        console.error("Error cancelling order:", err.message);
        throw new CustomError(err.message, 500);
    }
};

export const applyPromoService = async (
    checkoutToken: string,
    code: string,
) => {
    try {
        const key = `${getKey("user", "")}:${getKey(
            "checkout",
            checkoutToken,
        )}`;
        const checkoutDraft = await read<ICheckoutDraft>(key);

        if (!checkoutDraft) {
            throw new CustomError("Checkout draft not found or expired", 400);
        }

        const discount = await DiscountModel.findOne({
            where: { code, isDeleted: false },
        });

        if (!discount) {
            throw new CustomError("Invalid promo code", 400);
        }

        const promoCode: IPromoCode = {
            id: discount.id,
            code: discount.code,
            valueType: discount.valueType,
            amount: Number(discount.value),
        };

        if (!checkoutDraft.promoCodes) {
            checkoutDraft.promoCodes = [];
        }

        // Prevent duplicate promo codes
        const alreadyApplied = checkoutDraft.promoCodes.some(
            p => p.code === promoCode.code,
        );
        if (alreadyApplied) {
            throw new CustomError(
                `Promo code ${promoCode.code} is already applied`,
                400,
            );
        }

        checkoutDraft.promoCodes.push(promoCode);

        // Recalculate total price
        checkoutDraft.totalPrice = calculateTotalPriceWithMultiplePromos(
            checkoutDraft.subtotalPrice,
            checkoutDraft.promoCodes,
        );

        // Save back with TTL
        await write(
            key,
            JSON.stringify(checkoutDraft),
            REDIS_CONSTANTS.ABANDONED_CHECKOUT_TTL,
        );

        return checkoutDraft;
    } catch (err) {
        console.error("Error applying promo code:", err.message);
        throw new CustomError(err.message, 500);
    }
};

export const removePromoService = async (
    checkoutToken: string,
    code: string,
) => {
    try {
        const key = `${getKey("user", "")}:${getKey(
            "checkout",
            checkoutToken,
        )}`;
        const checkoutDraft = await read<ICheckoutDraft>(key);

        if (!checkoutDraft) {
            throw new CustomError("Checkout draft not found or expired", 400);
        }

        if (
            !checkoutDraft.promoCodes ||
            checkoutDraft.promoCodes.length === 0
        ) {
            throw new CustomError("No promo codes applied", 400);
        }

        // Remove the promo code by code
        checkoutDraft.promoCodes = checkoutDraft.promoCodes.filter(
            p => p.code !== code,
        );

        // Recalculate total price or reset if no promo codes left
        if (checkoutDraft.promoCodes.length > 0) {
            checkoutDraft.totalPrice = calculateTotalPriceWithMultiplePromos(
                checkoutDraft.subtotalPrice,
                checkoutDraft.promoCodes,
            );
        } else {
            checkoutDraft.totalPrice = checkoutDraft.subtotalPrice;
        }

        // Save back with TTL
        await write(
            key,
            JSON.stringify(checkoutDraft),
            REDIS_CONSTANTS.ABANDONED_CHECKOUT_TTL,
        );

        return checkoutDraft;
    } catch (err) {
        console.error("Error removing promo code:", err.message);
        throw new CustomError(err.message, 500);
    }
};

export const fetchOrders = async () => {
    try {
        return {};
    } catch (err) {
        console.error("Error fetching orders:", err.message);
        throw new CustomError(err.message, 500);
    }
};

const calculateTotalPriceWithMultiplePromos = (
    subtotal: number,
    promoCodes: IPromoCode[],
) => {
    let total = subtotal;

    // Apply fixed discounts first
    const fixedDiscounts = promoCodes.filter(
        p => p.valueType === EValueType.fixed,
    );
    const totalFixed = fixedDiscounts.reduce((sum, p) => sum + p.amount, 0);
    total -= totalFixed;

    // Apply percentage discounts on the new total
    const percentDiscounts = promoCodes.filter(
        p => p.valueType === EValueType.percent,
    );
    const totalPercent = percentDiscounts.reduce((sum, p) => sum + p.amount, 0);
    total -= (total * totalPercent) / 100;

    if (total < 0) total = 0;

    return total;
};
