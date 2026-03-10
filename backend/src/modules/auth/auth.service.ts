import pool from '../../config/db';
import { hashPassword, comparePassword } from '../../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import crypto from 'crypto';

interface User {
    id: number;
    email: string;
    name: string;
}

export async function registerUser(email: string, password: string, name: string) {
    const connection = await pool.getConnection();
    try {
        const [existing] = await connection.query<RowDataPacket[]>(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            throw new Error('Email already in use');
        }

        const hashed = await hashPassword(password);

        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
            [email, hashed, name]
        );

        const userId = result.insertId;
        const user: User = { id: userId, email, name };

        const accessToken = signAccessToken({ userId, email });
        const refreshToken = signRefreshToken({ userId, email });

        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

        await connection.query(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [userId, tokenHash, expiresAt]
        );

        return { user, accessToken, refreshToken };
    } finally {
        connection.release();
    }
}

export async function loginUser(email: string, password: string) {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id, email, password_hash, name FROM users WHERE email = ?',
        [email]
    );

    if (rows.length === 0) {
        throw new Error('Invalid credentials');
    }

    const userRecord = rows[0];
    const isValid = await comparePassword(password, userRecord.password_hash);

    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    const user: User = { id: userRecord.id, email: userRecord.email, name: userRecord.name };

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email });

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await pool.query(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
        [user.id, tokenHash, expiresAt]
    );

    return { user, accessToken, refreshToken };
}

export async function refreshTokens(oldRefreshToken: string) {
    try {
        const payload = verifyRefreshToken(oldRefreshToken);
        const tokenHash = crypto.createHash('sha256').update(oldRefreshToken).digest('hex');

        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id, revoked_at FROM refresh_tokens WHERE user_id = ? AND token_hash = ?',
            [payload.userId, tokenHash]
        );

        if (rows.length === 0 || rows[0].revoked_at !== null) {
            throw new Error('Invalid or revoked refresh token');
        }

        const accessToken = signAccessToken({ userId: payload.userId, email: payload.email });
        const newRefreshToken = signRefreshToken({ userId: payload.userId, email: payload.email });

        const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Revoke old token
            await connection.query(
                'UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = ?',
                [rows[0].id]
            );

            // Insert new token
            await connection.query(
                'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
                [payload.userId, newTokenHash, expiresAt]
            );

            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

        return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
}

export async function revokeRefreshToken(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await pool.query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?',
        [tokenHash]
    );
}
