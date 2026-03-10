import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { cookieConfig } from '../../config/security';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            res.status(400).json({ error: 'Email, password, and name are required' });
            return;
        }

        const result = await authService.registerUser(email, password, name);

        res.cookie('refresh_token', result.refreshToken, cookieConfig);
        res.status(201).json({
            message: 'Registration successful',
            user: result.user,
            accessToken: result.accessToken
        });
    } catch (error: any) {
        if (error.message === 'Email already in use') {
            res.status(409).json({ error: error.message });
            return;
        }
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const result = await authService.loginUser(email, password);

        res.cookie('refresh_token', result.refreshToken, cookieConfig);
        res.json({
            message: 'Login successful',
            user: result.user,
            accessToken: result.accessToken
        });
    } catch (error: any) {
        if (error.message === 'Invalid credentials') {
            res.status(401).json({ error: error.message });
            return;
        }
        next(error);
    }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            res.status(401).json({ error: 'Refresh token required' });
            return;
        }

        const result = await authService.refreshTokens(refreshToken);

        // Set new refresh token
        res.cookie('refresh_token', result.refreshToken, cookieConfig);
        res.json({
            accessToken: result.accessToken
        });
    } catch (error: any) {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const refreshToken = req.cookies.refresh_token;

        if (refreshToken) {
            await authService.revokeRefreshToken(refreshToken);
        }

        res.clearCookie('refresh_token', { ...cookieConfig, maxAge: 0 });
        res.json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
}
