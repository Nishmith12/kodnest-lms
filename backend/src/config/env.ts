import dotenv from 'dotenv';
dotenv.config();

export const env = {
    // Server
    PORT: parseInt(process.env.PORT || '5000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'kodnest_lms',
    DB_SSL: process.env.DB_SSL === 'true',

    // JWT
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'dev-access-secret',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret',
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    REFRESH_TOKEN_EXPIRY_DAYS: parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '30', 10),

    // CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

    // Cookie
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,
};
