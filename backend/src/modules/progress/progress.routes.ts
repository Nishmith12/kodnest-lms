import { Router } from 'express';
import * as progressController from './progress.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// All progress routes are protected
router.use(authMiddleware);

router.get('/subjects/:subjectId', progressController.getSubjectProgress);
router.get('/videos/:videoId', progressController.getVideoProgress);
router.post('/videos/:videoId', progressController.mapVideoProgress);

export default router;
