import { randomBytes } from "crypto";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateCheckoutToken = (): string => {
    const length = 32;
    const bytes = randomBytes(length);
    let token = "";

    for (let i = 0; i < length; i++) {
        // Map each byte to a character in chars
        token += chars[bytes[i] % chars.length];
    }

    return token;
};
