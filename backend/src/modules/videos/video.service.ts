import pool from '../../config/db';
import { RowDataPacket } from 'mysql2';
import { VideoItem, SectionItem } from '../subjects/subject.service';

export interface VideoDetail extends VideoItem {
    description: string;
    youtube_url: string;
    duration_seconds: number | null;
    subject_id: number;
    subject_title: string;
    section_title: string;
}

export async function getVideosBySubject(subjectId: number): Promise<VideoItem[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT v.id, v.section_id, v.title, v.order_index 
     FROM videos v
     JOIN sections s ON v.section_id = s.id
     WHERE s.subject_id = ?
     ORDER BY s.order_index ASC, v.order_index ASC`,
        [subjectId]
    );
    return rows as VideoItem[];
}

export async function getVideoDetail(videoId: number): Promise<VideoDetail | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT 
       v.id, v.section_id, v.title, v.description, v.youtube_url, v.order_index, v.duration_seconds,
       s.title as section_title, s.subject_id,
       sub.title as subject_title
     FROM videos v
     JOIN sections s ON v.section_id = s.id
     JOIN subjects sub ON s.subject_id = sub.id
     WHERE v.id = ?`,
        [videoId]
    );
    return rows.length > 0 ? (rows[0] as VideoDetail) : null;
}
