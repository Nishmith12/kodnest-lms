import { Router } from 'express';
import * as subjectController from './subject.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', subjectController.getSubjects);
router.get('/:subjectId', subjectController.getSubjectDetail);

// Protected routes
router.get('/:subjectId/tree', authMiddleware, subjectController.getSubjectTree);

export default router;
