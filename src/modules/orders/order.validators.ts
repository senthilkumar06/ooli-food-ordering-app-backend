import { ICheckoutRequest } from "@/interfaces/request.interface";
import { CustomError } from "@/utils/custom-error.util";

export const validateCheckout = (orderRequest: ICheckoutRequest) => {
    if (
        !orderRequest.lineItems ||
        !Array.isArray(orderRequest.lineItems) ||
        orderRequest.lineItems.length === 0
    ) {
        throw new CustomError("lineItems must be a non-empty array", 400);
    }
    for (const item of orderRequest.lineItems) {
        if (
            typeof item.productId !== "number" ||
            item.productId <= 0 ||
            typeof item.quantity !== "number" ||
            item.quantity <= 0
        ) {
            throw new CustomError(
                "Invalid productId or quantity in lineItems",
                400,
            );
        }
    }
};
