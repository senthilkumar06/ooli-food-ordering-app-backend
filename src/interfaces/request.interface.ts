import { EValueType } from "./types.interface";

export interface ICheckoutRequest {
    lineItems: ILineItem[];
}

export interface ILineItem {
    productId: number;
    quantity: number;
}

export interface IApplyPromo {
    code: string;
    checkoutToken: string;
}

export interface ICheckoutDraft {
    lineItems: ILineItem[];
    subtotalPrice: number;
    promoCodes?: IPromoCode[];
    totalPrice: number;
    createdAt: string;
}

export interface IPromoCode {
    id?: number;
    code: string;
    valueType: EValueType;
    amount: number;
}
