import pool from '../../config/db';
import { RowDataPacket } from 'mysql2';

export interface VideoProgress {
    video_id: number;
    last_position_seconds: number;
    is_completed: boolean;
}

export async function getUserCompletedVideoIds(userId: number, subjectId: number): Promise<Set<number>> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT p.video_id 
     FROM video_progress p
     JOIN videos v ON p.video_id = v.id
     JOIN sections s ON v.section_id = s.id
     WHERE p.user_id = ? AND s.subject_id = ? AND p.is_completed = TRUE`,
        [userId, subjectId]
    );
    return new Set(rows.map(row => row.video_id));
}

export async function getUserVideoProgress(userId: number, videoId: number): Promise<VideoProgress | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT video_id, last_position_seconds, is_completed FROM video_progress WHERE user_id = ? AND video_id = ?',
        [userId, videoId]
    );

    if (rows.length === 0) {
        return {
            video_id: videoId,
            last_position_seconds: 0,
            is_completed: false
        };
    }

    return {
        video_id: rows[0].video_id,
        last_position_seconds: rows[0].last_position_seconds,
        is_completed: Boolean(rows[0].is_completed)
    };
}

export async function upsertVideoProgress(
    userId: number,
    videoId: number,
    lastPosition: number,
    isCompleted: boolean
): Promise<void> {
    const completedAt = isCompleted ? new Date() : null;

    await pool.query(
        `INSERT INTO video_progress (user_id, video_id, last_position_seconds, is_completed, completed_at)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       last_position_seconds = VALUES(last_position_seconds),
       is_completed = VALUES(is_completed),
       completed_at = IF(VALUES(is_completed) = TRUE AND is_completed = FALSE, VALUES(completed_at), completed_at)`,
        [userId, videoId, lastPosition, isCompleted, completedAt]
    );
}

export async function getSubjectProgressStats(userId: number, subjectId: number) {
    const [totalRows] = await pool.query<RowDataPacket[]>(
        `SELECT COUNT(v.id) as total
     FROM videos v
     JOIN sections s ON v.section_id = s.id
     WHERE s.subject_id = ?`,
        [subjectId]
    );

    const [completedRows] = await pool.query<RowDataPacket[]>(
        `SELECT COUNT(p.id) as completed
     FROM video_progress p
     JOIN videos v ON p.video_id = v.id
     JOIN sections s ON v.section_id = s.id
     WHERE p.user_id = ? AND s.subject_id = ? AND p.is_completed = TRUE`,
        [userId, subjectId]
    );

    const total = totalRows[0].total;
    const completed = completedRows[0].completed;

    return {
        total_videos: total,
        completed_videos: completed,
        percent_complete: total > 0 ? Math.round((completed / total) * 100) : 0
    };
}
