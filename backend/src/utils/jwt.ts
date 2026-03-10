import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/security';

interface TokenPayload {
    userId: number;
    email: string;
}

export function signAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, jwtConfig.accessToken.secret, {
        expiresIn: jwtConfig.accessToken.expiresIn,
    });
}

export function signRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, jwtConfig.refreshToken.secret, {
        expiresIn: `${jwtConfig.refreshToken.expiresInDays}d`,
    });
}

export function verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, jwtConfig.accessToken.secret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, jwtConfig.refreshToken.secret) as TokenPayload;
}
