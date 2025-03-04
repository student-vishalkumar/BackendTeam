import { StatusCodes } from 'http-status-codes';

import { getChannelByIdService, updateChannelByIdService } from '../services/channelService.js';
import { customErrorResponse, internalErrorResponse, successResponse } from '../utils/common/responseObject.js';

export const getChannelByIdController = async (req, res) => {
  try {
    const response = await getChannelByIdService(req.params.channelId,
        req.user
    );

    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'channel fetched successfuly'));
  } catch (error) {
    console.log('getChannelByIdController error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const updateChannelByIdController = async (req, res) => {
  try {
    const response = await updateChannelByIdService(req.params.channelId, req.body, req.user);

    return res.status(StatusCodes.OK).json(successResponse(response, 'channel name updated success fully'));
  } catch (error) {
    console.log('channel by Id error', error)

    if(error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).internalErrorResponse(error);
  }
}
