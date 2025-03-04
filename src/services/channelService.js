import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channelRepository.js';
import messageRepository from '../repositories/messageRepository.js';
import ClientError from '../utils/error/ClientError.js';
import { isUserAdminOfWorkspace, isUserMemberOfWorkspace } from './workspaceService.js';

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

    
    const messages = await messageRepository.getPaginatedMessaged(
      {
        channelId
      },
      1,
      20
    );

    return {
      messages,
      _id: channel._id,
      name: channel.name,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
      workspaceId: channel.workspaceId
    }
  } catch (error) {
    console.log('getChannelByIdService error', error);
    throw error;
  }
};

export const updateChannelByIdService = async(channelId, data, userId) => {
  try {
    const channel = await channelRepository.getChannelWithWorkspaceDetails(channelId);

    if(!channel || !channel.workspaceId) {
      throw new ClientError({
        message: 'Invalid data sent from the user',
        explanation: 'channel details not foun',
        statusCode: StatusCodes.NOT_FOUND
      })
    }

    console.log('userID', userId);
    console.log('memberId', channel.workspaceId.members);
    console.log('channl wsid', channel.workspaceId)

    const isUserAdminOfWorkspaceOrNot = isUserAdminOfWorkspace(channel.workspaceId, userId);

    if(!isUserAdminOfWorkspaceOrNot) {
      throw new ClientError({
        message: 'user is not admin of the workspace, hence can not do the changes is workspace',
        explanation: 'user is not admin of workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      })
    }

    console.log('data', data)
    const updatedChannel = await channelRepository.update(channelId, data);

    return updatedChannel;
  } catch (error) {

    console.log('update channel service error', error);

    throw error;
  }
}
