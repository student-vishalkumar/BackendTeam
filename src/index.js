import express from 'express';
import { StatusCodes } from 'http-status-codes';

import bullServerAdapter from './config/bullBoardConfig.js';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import apiRouter from './routes/apiRouter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/ui', bullServerAdapter.getRouter());

app.use('/api', apiRouter);


app.get('/ping', (req, res) => {
    return res.status(StatusCodes.OK).json({
        message: 'pong'
    })
})

app.listen(PORT, async () => {
    console.log(`server is running on ${PORT}`);
    connectDB();
    
})



// kumar878vishal
// oE2mCd5P34Nv1fEO

// mongodb+srv://kumar878vishal:<db_password>@cluster0.xb6rw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0