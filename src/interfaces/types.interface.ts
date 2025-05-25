export interface IImages {
    thumbnail: string;
    mobile: string;
    tablet: string;
    desktop: string;
}

export enum EOrderStatus {
    draft,
    placed,
    confirmed,
    fulfilled,
    closed,
    cancelled,
}

export enum EValueType {
    fixed,
    percent,
}

export enum EDiscountType {
    all,
}

export enum ETargetType {
    line,
}
