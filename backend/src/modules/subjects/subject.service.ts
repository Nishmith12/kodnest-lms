import pool from '../../config/db';
import { RowDataPacket } from 'mysql2';

export interface SubjectItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    thumbnail_url: string | null;
    is_published: boolean;
}

export interface SectionItem {
    id: number;
    subject_id: number;
    title: string;
    order_index: number;
    videos?: VideoItem[];
}

export interface VideoItem {
    id: number;
    section_id: number;
    title: string;
    order_index: number;
    is_completed?: boolean;
    locked?: boolean;
}

export async function getPublishedSubjects(): Promise<SubjectItem[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id, title, slug, description, thumbnail_url, is_published FROM subjects WHERE is_published = TRUE'
    );
    return rows as SubjectItem[];
}

export async function getSubjectById(subjectId: number): Promise<SubjectItem | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id, title, slug, description, thumbnail_url, is_published FROM subjects WHERE id = ?',
        [subjectId]
    );
    return rows.length > 0 ? (rows[0] as SubjectItem) : null;
}

export async function getSubjectSections(subjectId: number): Promise<SectionItem[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id, subject_id, title, order_index FROM sections WHERE subject_id = ? ORDER BY order_index ASC',
        [subjectId]
    );
    return rows as SectionItem[];
}
