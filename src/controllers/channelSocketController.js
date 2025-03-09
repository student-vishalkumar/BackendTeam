import { JOIN_CHANNEL } from "../utils/common/eventConstant.js";

export default function messageHandlers(io, socket) {
    socket.on(JOIN_CHANNEL, async function joinChannelHandler(data, cb) {
        
        const roomId = data.channelId;

        console.log('jch',data.channelId, roomId);
        socket.join(roomId);

        console.log(`User ${socket.id} join the channel ${roomId}`)
        cb?.({
            success: true,
            message: 'successfully joined the channel',
            data: roomId
        })
    })
}