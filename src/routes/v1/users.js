import express from 'express';

import { signup } from '../../controllers/userController.js';
import { userSignUpSchema } from '../../validators/userSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express();

router.post('/signup', validate(userSignUpSchema), signup);

export default router;