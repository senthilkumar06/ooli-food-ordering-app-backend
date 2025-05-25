import { createClient, RedisClientType } from "redis";

const REDIS_URL = "redis://localhost:6379";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const MAX_RETRY_DELAY = 3000;

let redisClient: RedisClientType;

/**
 * Returns namespaced key.
 * e.g., getKey('cart:user', '123') -> 'cart:user:123'
 */
export const getKey = (namespace: string, id: string): string =>
    `${namespace}:${id}`;

/**
 * Initializes the Redis connection with auto-retry.
 */
export const initRedis = async (): Promise<void> => {
    redisClient = createClient({
        url: REDIS_URL,
        socket: {
            reconnectStrategy: retries => {
                const delay = Math.min(retries * 100, MAX_RETRY_DELAY);
                console.warn(`🔄 Redis retry #${retries}, waiting ${delay}ms`);
                return delay;
            },
        },
    });

    redisClient.on("error", err => {
        console.error("❌ Redis Error:", err);
    });

    await redisClient.connect();
    console.log("✅ Connected to Redis");
};

/**
 * Writes a value to Redis with optional TTL.
 */
export const write = async <T>(
    key: string,
    value: T,
    ttlInSeconds = DEFAULT_TTL_SECONDS,
): Promise<void> => {
    const data = JSON.stringify(value);
    await redisClient.set(key, data, { EX: ttlInSeconds });
};

/**
 * Reads a value from Redis and parses it as JSON.
 */
export const read = async <T>(key: string): Promise<T | null> => {
    const data = await redisClient.get(key);
    return data ? (JSON.parse(data.toString()) as T) : null;
};

/**
 * Reads a value from Redis and parses it as JSON.
 */
export const ttl = async (key: string): Promise<number> => {
    const data = await redisClient.ttl(key);
    return data;
};

/**
 * Deletes a key from Redis.
 */
export const remove = async (key: string): Promise<void> => {
    await redisClient.del(key);
};
