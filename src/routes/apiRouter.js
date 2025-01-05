import express from 'express';

const apiRouter = express.Router();

apiRouter.use('/v1', v1Router);

export default apiRouter;