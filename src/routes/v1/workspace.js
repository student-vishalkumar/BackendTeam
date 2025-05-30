import express from 'express';

import { addChannelToWorkspaceController, addMemberToWorkspaceController, createWorkspaceController, deleteWorkspaceController, getWorkspaceByJoinCodeController, getWorkspaceController, getWorkspacesUserIsMemberOfController, joinWorkspaceController, removeMemberFromWorkspaceController, resetJoinCodeController, updateWorkspaceController } from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/isauthMiddle.js';
import {addChannelToWorkspaceSchema,addMemberToWorkspaceSchema, createWorkspaceSchema } from '../../validators/createWorkspaceSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post('/', isAuthenticated, validate(createWorkspaceSchema), createWorkspaceController);



router.get('/', isAuthenticated, getWorkspacesUserIsMemberOfController);

router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);

router.get('/:workspaceId', isAuthenticated, getWorkspaceController);

router.get('/join/:joinCode', isAuthenticated, getWorkspaceByJoinCodeController);

router.put('/:workspaceId', isAuthenticated, updateWorkspaceController);

router.put('/:workspaceId/join', isAuthenticated, joinWorkspaceController);

router.put('/:workspaceId/members', isAuthenticated, validate(addMemberToWorkspaceSchema), addMemberToWorkspaceController);

router.put('/:workspaceId/channels', isAuthenticated, validate(addChannelToWorkspaceSchema), addChannelToWorkspaceController);

router.put('/:workspaceId/joinCode/reset', isAuthenticated, resetJoinCodeController);

router.patch('/removeMember', isAuthenticated, removeMemberFromWorkspaceController);

export default router;