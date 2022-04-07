import { Router } from 'express';

import {healthCheck} from '../controllers/healthController';

const router = Router();

router.use('/health', healthCheck)

export default router;
