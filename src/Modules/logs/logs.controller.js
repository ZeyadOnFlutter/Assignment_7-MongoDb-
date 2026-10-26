import { Router } from 'express';
import * as logsService from './logs.service.js';

const router = Router();

router.post('/collection/logs/capped', logsService.createLogsCollection);
router.post('/logs', logsService.insertLog);

export default router;
