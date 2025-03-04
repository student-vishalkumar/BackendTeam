import express from 'express';

import { getChannelByIdController, updateChannelByIdController } from '../../controllers/channelController.js';
import { isAuthenticated } from '../../middlewares/isauthMiddle.js';

const router = express.Router();

router.get('/:channelId',isAuthenticated, getChannelByIdController);

router.put('/:channelId',isAuthenticated, updateChannelByIdController)

export default router
