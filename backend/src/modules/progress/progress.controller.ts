import { Request, Response, NextFunction } from 'express';
import * as progressService from './progress.service';

export async function getSubjectProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const subjectId = parseInt(req.params.subjectId, 10);
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const stats = await progressService.getSubjectProgressStats(userId, subjectId);
        res.json(stats);
    } catch (error) {
        next(error);
    }
}

export async function getVideoProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const videoId = parseInt(req.params.videoId, 10);
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const progress = await progressService.getUserVideoProgress(userId, videoId);
        res.json(progress);
    } catch (error) {
        next(error);
    }
}

export async function mapVideoProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const videoId = parseInt(req.params.videoId, 10);
        const userId = req.user?.userId;
        const { last_position_seconds, is_completed } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (last_position_seconds === undefined) {
            res.status(400).json({ error: 'last_position_seconds is required' });
            return;
        }

        await progressService.upsertVideoProgress(
            userId,
            videoId,
            Math.max(0, parseInt(last_position_seconds, 10)),
            Boolean(is_completed)
        );

        res.json({ message: 'Progress updated successfully' });
    } catch (error) {
        next(error);
    }
}
