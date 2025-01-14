import express from 'express';
import { StatusCodes } from 'http-status-codes';

import connectDB from './config/dbConfig.js';
import mailer from './config/mailConfig.js'
import { PORT } from './config/serverConfig.js';
import apiRouter from './routes/apiRouter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);


app.get('/ping', (req, res) => {
    return res.status(StatusCodes.OK).json({
        message: 'pong'
    })
})

app.listen(PORT, async () => {
    console.log(`server is running on ${PORT}`);
    connectDB();
    const mailRes = await mailer.sendMail({
        from: 'vishalbjrkumar@gmail.com',
        to: 'kumar878vishal@gmail.com',
        subject: 'sample mail',
        text: 'welcom in message slack'
    })

    console.log(mailRes)
})



// kumar878vishal
// oE2mCd5P34Nv1fEO

// mongodb+srv://kumar878vishal:<db_password>@cluster0.xb6rw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0