import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { addEmailtoMailQueue } from '../producers/mailQueueProducer.js';
import channelRepository from '../repositories/channelRepository.js';
import userRepository from '../repositories/userRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import { workspaceJoinMail } from '../utils/common/mailObject.js';
import ClientError from '../utils/error/ClientError.js';
import ValidationError from '../utils/error/validationError.js';

export const isUserAdminOfWorkspace = (workspace, userId) => {
  return workspace.members.find(
    (member) => (member.memberId.toString() === userId || member.memberId._id.toString() === userId) && member.role === 'admin'
  );
}

export const isUserMemberOfWorkspace = (workspace, userId) => {

  return workspace.members.find(
    (member) => member.memberId._id.toString() === userId
  );
};

const isChannelAlreadyPartOfWorkspace = (workspace, channelName) => {
  
  return workspace.channels.find(
    (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
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
    const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);

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

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceByJoinCode(joinCode);

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
        explanation: 'user is not the member of workspace',
        message: 'user is not the member of workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    return workspace;
  } catch (error) {
    console.log('getWorkspaceByJoinCodeService error', error);

    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);

    if (!isAdmin) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'user is not admin of workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const updatedWorkspace = await workspaceRepository.update(
      workspaceId,
      workspaceData
    );

    return updatedWorkspace;
  } catch (error) {
    console.log('updatedWorkspaceService error', error);
    throw error;
  }
};

export const resetJoinCodeService = async(workspaceId, userId) => {
  try {
    const newJoinCode = uuidv4().substring(0, 6).toUpperCase();
    const updatedWorkspace = await updateWorkspaceService(workspaceId, {
      joinCode: newJoinCode
    },
  userId);

  return updatedWorkspace;
  } catch (error) {
    console.log('resetJoinCodeService error', error);
    throw error;
  }
}

export const addMemberToWorkspaceService = async (workspaceId, memberId, role, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const isValidUser = await userRepository.getById(memberId);

    if (!isValidUser) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'user not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, memberId);
    if (isMember) {
      throw new ClientError({
        explanation: 'User is already member of the workspace',
        message: 'User is already member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const response = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role
    );

    addEmailtoMailQueue({
      ...workspaceJoinMail(workspace),
      to: isValidUser.email
    });

    return response;
  } catch (error) {
    console.log('addMemberToWorkspaceService', error);
    throw error;
  }
};

export const addChannelTOWorkspaceService = async (
  workspaceId,
  channelName,
  userId
) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: 'User is not an admin of the workspace',
        message: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }


    const isChannelPartOfWorkspace = isChannelAlreadyPartOfWorkspace(
      workspace,
      channelName
    );
    if (isChannelPartOfWorkspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Channel already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    const response = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );
    return response;
  } catch (error) {
    console.log('addChannelTOWorkspace error',error);
    throw error;
  }
};


export const joinWorkspaceService = async(workspaceId, joinCode, userId) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    console.log('wsjc', workspace);
    console.log('jc', joinCode)
    if(workspace.joinCode !== joinCode) {
      throw new ClientError({
        explanation: 'Invalid data sent from the user',
        message: 'join code is not matched',
        statusCode: StatusCodes.NOT_FOUND
      })
    }

    const updatedWorkspace = await workspaceRepository.addMemberToWorkspace(workspaceId, userId, 'member');

    return updatedWorkspace;
    
  } catch (error) {
    console.log('join workspace service error', error);

    throw error;
  }
}

export const removeMemberFromWorkspaceService = async(userId, workspaceId, memberId)=> {

  if(userId.toString() === memberId.toString()) {
    throw {
      message: "Admin can not remove yourself from Workspace",
      explanation: "User is Admin of the Workspace",
      statusCode: StatusCodes.BAD_REQUEST
    }
  }

  const workspace = await workspaceRepository.getById(workspaceId);

  console.log('ws', workspace);

  if(!workspace) {
    throw {
      message: "Workspace not found",
      explanation: "Invalid data sent",
      statusCode: StatusCodes.NOT_FOUND
    }
  }

  const isAdmin = isUserAdminOfWorkspace(workspace,userId);

  console.log('isAdmin', isAdmin);
  if(!isAdmin) {
    throw {
      message: "Member is not authorized to remove members from the worspace",
      explanation: "Unauthorized person",
      statusCode: StatusCodes.UNAUTHORIZED
    }
  }

  const isMember = isUserMemberOfWorkspace(workspace,memberId);

  console.log('isMember', isMember);
  if(!isMember) {
    throw {
      message: "Member is not part of the workspace",
      explanation: "Invalid data sent from the user",
      statusCode: StatusCodes.BAD_REQUEST
    }
  }

  const response = await workspaceRepository.removeMemberFromWorkspace(workspaceId, memberId)

  console.log('response', response);

  return response;
  
}
