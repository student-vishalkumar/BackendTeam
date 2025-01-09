import express from 'express';

import { signin, signup } from '../../controllers/userController.js';
import { userSignin, userSignUpSchema } from '../../validators/userSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express();

router.post('/signup', validate(userSignUpSchema), signup);

router.post('/signin', validate(userSignin), signin);

export default router;