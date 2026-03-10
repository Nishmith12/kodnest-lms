import { env } from './env';
import { CookieOptions } from 'express';

export const jwtConfig = {
    accessToken: {
        secret: env.ACCESS_TOKEN_SECRET,
        expiresIn: env.ACCESS_TOKEN_EXPIRY,
    },
    refreshToken: {
        secret: env.REFRESH_TOKEN_SECRET,
        expiresInDays: env.REFRESH_TOKEN_EXPIRY_DAYS,
    },
};

export const cookieConfig: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: env.NODE_ENV === 'production' ? env.COOKIE_DOMAIN : undefined,
    path: '/',
};

export const corsConfig = {
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
