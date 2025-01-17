import express from 'express';

import { isMemberPartOfWorkspaceController } from '../../controllers/memberController.js';
import { isAuthenticated } from '../../middlewares/isauthMiddle.js';

const router = express.Router();

router.get('/workspace/:workspaceId', isAuthenticated, isMemberPartOfWorkspaceController);

export default router;

