import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channelRepository.js';
import ClientError from '../utils/error/ClientError.js';
import { isUserMemberOfWorkspace } from './workspaceService.js';

export const getChannelByIdService = async (channelId, userId) => {
  try {
    const channel = await channelRepository.getChannelWithWorkspaceDetails(channelId);

    if (!channel || !channel.workspaceId) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'channel not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isUserPartOfWorkspace = isUserMemberOfWorkspace(
      channel.workspaceId,
      userId
    );

    if (!isUserPartOfWorkspace) {
      throw new ClientError({
        message:
          'User is not a member of the workspace and hence cannot access the channel',
        explanation: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return channel;
  } catch (error) {
    console.log('getChannelByIdService error', error);
    throw error;
  }
};
