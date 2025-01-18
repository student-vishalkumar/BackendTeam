import { createMessageService } from '../services/messageService.js';
import {
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_RECIVED_EVENT
} from '../utils/common/eventConstant.js';

export default function messageHandlers(io, socket) {
  socket.on(NEW_MESSAGE_EVENT, async function createMessageHandler(data, cb) {
    const { channelId } = data;
    const messageResponse = await createMessageService(data);
    // socket.broadcast.emit(NEW_MESSAGE_RECIVED_EVENT, messageResponse);
    io.to(channelId).emit(NEW_MESSAGE_RECIVED_EVENT, messageResponse)
    cb({
      success: true,
      message: 'Successfully created the message',
      data: messageResponse
    });
  });
}
