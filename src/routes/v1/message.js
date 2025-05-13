import express from 'express';

import { getMessageController } from '../../controllers/getMessageController.js';
import {isAuthenticated} from '../../middlewares/isauthMiddle.js'

const router = express.Router();

router.get('/:channelId', isAuthenticated, getMessageController);

export default router;;