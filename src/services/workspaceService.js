import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import channelRepository from '../repositories/channelRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import ClientError from '../utils/error/ClientError.js';
import ValidationError from '../utils/error/validationError.js';

const isUserAdminOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (member) => member.memberId.toString() === userId && member.role === 'admin'
  );
};

const isUserMemberOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (member) => member.memberId.toString() === userId
  );
};

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();

    const response = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode
    });

    console.log('created workspace', response);
    console.log('workspace id', response._id);

    console.log('worlspaceData.owner', workspaceData.owner);
    await workspaceRepository.addMemberToWorkspace(
      response._id,
      workspaceData.owner,
      'admin'
    );

    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      response._id,
      'general'
    );

    return updatedWorkspace;
  } catch (error) {
    console.log('Create workspace service error', error);
    if (error.name === 'ValidationError') {
      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
      throw new ValidationError(
        {
          error: ['A workspace with same details already exists']
        },
        'A workspace with same details already exists'
      );
    }
    throw error;
  }
};

export const getWorkspacesUserIsMemberOfService = async (userId) => {
  try {
    const response =
      await workspaceRepository.fetchAllWorkspaceByMemberId(userId);

    return response;
  } catch (error) {
    console.log('get workspaces error', error);
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAllowed = isUserAdminOfWorkspace(workspace, userId);

    if (isAllowed) {
      await channelRepository.deleteMany(workspace.channles);

      const response = await workspaceRepository.delete(workspaceId);

      return response;
    }

    throw new ClientError({
      explanation: 'User is either not a memeber or an admin of the workspace',
      message: 'User is not allowed to delete the workspace',
      statusCode: StatusCodes.UNAUTHORIZED
    });
  } catch (error) {
    console.log('deleteWSservice error', error);
    throw error;
  }
};

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        explanation: 'Invalid data sent from the Client',
        message: 'user is not member of workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    return workspace;
  } catch (error) {
    console.log('get workspace error', error);
    throw error;
  }
};

export const getWorkspaceByJoinCodeService = async (joinCode) => {
  try {
    const workspace = workspaceRepository.getWorkspaceByJoinCode(joinCode);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    return workspace;

  } catch (error) {
    console.log('getWorkspaceByJoinCodeService error', error);

    throw error;
  }

};
