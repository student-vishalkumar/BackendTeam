import express from 'express';

const router = express();

router.use('/', (req, res) => {
    return res.status(200).json({
        message: 'Get/users'
    })
})

export default router;