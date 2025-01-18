import express from 'express';
import { createServer } from 'http';
import { StatusCodes } from 'http-status-codes';
import { Server } from 'socket.io';

import bullServerAdapter from './config/bullBoardConfig.js';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import channelSocketHandler from './controllers/channelSocketController.js';
import messageSocketHandler from './controllers/messageSocketController.js'
import apiRouter from './routes/apiRouter.js';


const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/ui', bullServerAdapter.getRouter());

app.use('/api', apiRouter);


app.get('/ping', (req, res) => {
    return res.status(StatusCodes.OK).json({
        message: 'pong'
    })
})

io.on('connection', (socket) => {
    messageSocketHandler(io, socket);
    channelSocketHandler(io, socket);
})

server.listen(PORT, async () => {

    console.log(`server is running on ${PORT}`);
    connectDB();
    
})



// kumar878vishal
// oE2mCd5P34Nv1fEO

// mongodb+srv://kumar878vishal:<db_password>@cluster0.xb6rw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0