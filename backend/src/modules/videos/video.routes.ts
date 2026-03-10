import { Router } from 'express';
import * as videoController from './video.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// These routes enforce auth
router.use(authMiddleware);

router.get('/:videoId', videoController.getVideo);
router.get('/subject/:subjectId/first-video', videoController.getFirstVideo);

export default router;
