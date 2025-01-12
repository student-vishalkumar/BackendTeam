import express from 'express';

import { createWorkspaceController, deleteWorkspaceController, getWorkspaceController, getWorkspacesUserIsMemberOfController } from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/isauthMiddle.js';
import createWorkspaceSchema from '../../validators/createWorkspaceSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post('/', isAuthenticated, validate(createWorkspaceSchema), createWorkspaceController);



router.get('/', isAuthenticated, getWorkspacesUserIsMemberOfController);

router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);

router.get('/:workspaceId', isAuthenticated, getWorkspaceController);

export default router;