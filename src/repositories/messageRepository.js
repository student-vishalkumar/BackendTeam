import Message from '../Schema/message.js';
import crudRepository from './crudRepository.js';
const messageRepository = {
  ...crudRepository(Message),

  getPaginatedMessaged: async (messageParams, page, limit) => {
    const messages = await Message.find(messageParams)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('senderId', 'username email avatar');

      return messages;
  },

  getMessageDetails: async (messageId) => {
    const messageDetails = await Message.findById(messageId).populate('senderId', 'username email avatar');

    return messageDetails;
  }
};


export default messageRepository;