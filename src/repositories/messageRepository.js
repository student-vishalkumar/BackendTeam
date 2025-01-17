import Message from '../Schema/message.js';
import crudRepository from './crudRepository.js';
const messageRepository = {
  ...crudRepository(Message),

  getPaginatedMessaged: async (messageParama, page, limit) => {
    const messages = await Message.find(messageParama)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('senderId', 'username email .avatar');

      return messages;
  }
};


export default messageRepository;