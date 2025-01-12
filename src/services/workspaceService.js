import { v4 as uuidv4 } from 'uuid';

import workspaceRepository from '../repositories/workspaceRepository.js';
import ValidationError from '../utils/error/validationError.js';

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();

    const response = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode
    });

    console.log('created workspace', response);
    console.log('workspace id' , response._id);

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
    const response = await workspaceRepository.fetchAllWorkspaceByMemberId(userId);

    return response;
  } catch (error) {
    console.log('get workspaces error', error);
    throw error;
  }
}
