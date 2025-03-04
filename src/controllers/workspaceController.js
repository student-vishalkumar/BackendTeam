
import { StatusCodes } from 'http-status-codes';

import {
    addChannelTOWorkspaceService,
  addMemberToWorkspaceService,
  createWorkspaceService,
  deleteWorkspaceService,
  getWorkspaceByJoinCodeService,
  getWorkspaceService,
  getWorkspacesUserIsMemberOfService,
  joinWorkspaceService,
  resetJoinCodeService,
  updateWorkspaceService
} from '../services/workspaceService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js';

export const createWorkspaceController = async (req, res) => {
  try {
    console.log('req.user', req.user);
    const response = await createWorkspaceService({
      ...req.body,
      owner: req.user
    });

    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(response, 'workspace created successfully'));
  } catch (error) {
    console.log('workspaceController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getWorkspacesUserIsMemberOfController = async (req, res) => {
  try {
    const workspaces = await getWorkspacesUserIsMemberOfService(req.user);

    return res
      .status(StatusCodes.OK)
      .json(successResponse(workspaces, 'workspaces fetched successfully'));
  } catch (error) {
    console.log(getWorkspacesUserIsMemberOfController, error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(internalErrorResponse(error));
  }
};

export const deleteWorkspaceController = async (req, res) => {
  try {
    const response = await deleteWorkspaceService(
      req.params.workspaceId,
      req.user
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'workspace deleted successfully'));
  } catch (error) {
    console.log('delete Workspace Controller error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getWorkspaceController = async (req, res) => {
  try {
    const response = await getWorkspaceService(
      req.params.workspaceId,
      req.user
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'workspace fetch successfully'));
  } catch (error) {
    console.log('get workspace controller error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const getWorkspaceByJoinCodeController = async (req, res) => {
  try {
    const userId = req.user.toString();
    const response = await getWorkspaceByJoinCodeService(
      req.params.joinCode,
      userId
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'workspace fetched successfully'));
  } catch (error) {
    console.log('getWorkspaceByJoinCodeController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const updateWorkspaceController = async (req, res) => {
  try {
    const response = await updateWorkspaceService(
      req.params.workspaceId,
      req.body,
      req.user
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Workspace updated successfully'));
  } catch (error) {
    console.log('update workspace controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const addMemberToWorkspaceController = async (req, res) => {
  try {
    const response = await addMemberToWorkspaceService(
      req.params.workspaceId,
      req.body.memberId,
      req.body.role || 'member',
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(response, 'Member added to workspace successfully')
      );
  } catch (error) {
    console.log('add member to workspace controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const addChannelToWorkspaceController = async (req, res) => {
  try {
    console.log('channelName', req.body.channelName);
    const response = await addChannelTOWorkspaceService(
      req.params.workspaceId,
      req.body.channelName,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(
        successResponse(response, 'Channel added to workspace successfully')
      );
  } catch (error) {
    console.log('add channel to workspace controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const resetJoinCodeController = async (req, res) => {
  try {
    const response = await resetJoinCodeService(req.params.workspaceId, req.user);

    console.log('response', response)

    return res.status(StatusCodes.OK).json(
      successResponse(response, 'join code reset successfully')
    );
  } catch (error) {
    console.log('reset joinCode Controller error', error);
    if(error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      internalErrorResponse(error)
    );

  }
}

export const joinWorkspaceController = async(req, res) => {
  try {
    const response = await joinWorkspaceService(req.params.workspaceId, req.body.joinCode, req.user);

    return res.status(StatusCodes.OK).json(successResponse(response, 'joined workspace successfully'));
  } catch (error) {
    console.log('join workspace controller error', error);

    if(error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error))
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalErrorResponse(error));
  }
}
