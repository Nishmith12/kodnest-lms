import { Request, Response, NextFunction } from 'express';
import * as videoService from './video.service';
import * as subjectService from '../subjects/subject.service';
import * as progressService from '../progress/progress.service';
import { getGlobalVideoOrder, getPrevNextVideos, isVideoLocked } from '../../utils/ordering';

export async function getVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const videoId = parseInt(req.params.videoId, 10);
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const video = await videoService.getVideoDetail(videoId);
        if (!video) {
            res.status(404).json({ error: 'Video not found' });
            return;
        }

        const subjectId = video.subject_id;
        const sections = await subjectService.getSubjectSections(subjectId);
        const subjectVideos = await videoService.getVideosBySubject(subjectId);

        const globalOrder = getGlobalVideoOrder(sections, subjectVideos);
        const completedVideoIds = await progressService.getUserCompletedVideoIds(userId, subjectId);

        const { locked, prerequisiteVideoId } = isVideoLocked(video.id, globalOrder, completedVideoIds);

        const { previousVideoId, nextVideoId } = getPrevNextVideos(video.id, globalOrder);

        res.json({
            ...video,
            previous_video_id: previousVideoId,
            next_video_id: nextVideoId,
            locked,
            unlock_reason: locked ? 'You must complete the previous video first.' : null
        });
    } catch (error) {
        next(error);
    }
}

export async function getFirstVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const subjectId = parseInt(req.params.subjectId, 10);
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const sections = await subjectService.getSubjectSections(subjectId);
        const subjectVideos = await videoService.getVideosBySubject(subjectId);

        if (sections.length === 0 || subjectVideos.length === 0) {
            res.status(404).json({ error: 'No content available for this subject' });
            return;
        }

        const globalOrder = getGlobalVideoOrder(sections, subjectVideos);
        const completedVideoIds = await progressService.getUserCompletedVideoIds(userId, subjectId);

        // Find the first unlocked video that is NOT completed
        let firstVideoId = globalOrder[0].id; // Default to the first one available

        for (const v of globalOrder) {
            const { locked } = isVideoLocked(v.id, globalOrder, completedVideoIds);
            if (!locked && !completedVideoIds.has(v.id)) {
                firstVideoId = v.id;
                break;
            }
        }

        res.json({ video_id: firstVideoId });
    } catch (error) {
        next(error);
    }
}
