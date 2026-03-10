import { Request, Response, NextFunction } from 'express';
import * as subjectService from './subject.service';
import * as videoService from '../videos/video.service';
import * as progressService from '../progress/progress.service';
import { getGlobalVideoOrder, isVideoLocked } from '../../utils/ordering';

export async function getSubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const subjects = await subjectService.getPublishedSubjects();
        res.json(subjects);
    } catch (error) {
        next(error);
    }
}

export async function getSubjectDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const subjectId = parseInt(req.params.subjectId, 10);
        const subject = await subjectService.getSubjectById(subjectId);

        if (!subject) {
            res.status(404).json({ error: 'Subject not found' });
            return;
        }

        res.json(subject);
    } catch (error) {
        next(error);
    }
}

export async function getSubjectTree(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const subjectId = parseInt(req.params.subjectId, 10);
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const subject = await subjectService.getSubjectById(subjectId);
        if (!subject) {
            res.status(404).json({ error: 'Subject not found' });
            return;
        }

        const sections = await subjectService.getSubjectSections(subjectId);
        const videos = await videoService.getVideosBySubject(subjectId);
        const completedVideoIds = await progressService.getUserCompletedVideoIds(userId, subjectId);

        const globalOrder = getGlobalVideoOrder(sections, videos);

        const sectionsWithVideos = sections.map(section => {
            const sectionVideos = videos
                .filter(v => v.section_id === section.id)
                .map(video => {
                    const lockedInfo = isVideoLocked(video.id, globalOrder, completedVideoIds);
                    return {
                        id: video.id,
                        title: video.title,
                        order_index: video.order_index,
                        is_completed: completedVideoIds.has(video.id),
                        locked: lockedInfo.locked,
                    };
                });

            return {
                id: section.id,
                title: section.title,
                order_index: section.order_index,
                videos: sectionVideos
            };
        });

        res.json({
            id: subject.id,
            title: subject.title,
            sections: sectionsWithVideos
        });
    } catch (error) {
        next(error);
    }
}
