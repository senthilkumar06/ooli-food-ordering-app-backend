export const encodeNextToken = (data: {
    lastPrice: number;
    lastId: number | string;
}): string => {
    const json = JSON.stringify(data);
    const base64 = Buffer.from(json).toString("base64");
    // Convert to Base64URL
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const decodeNextToken = (
    token: string,
): {
    lastPrice: number;
    lastId: number | string;
} => {
    // Convert back to standard Base64
    let base64 = token.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
        base64 += "=";
    }
    try {
        const json = Buffer.from(base64, "base64").toString("utf-8");
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
};
