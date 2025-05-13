import { StatusCodes } from 'http-status-codes';

import { getMessagePaginatedService } from '../services/messageService.js';
import { customErrorResponse, internalErrorResponse, successResponse } from '../utils/common/responseObject.js';

export const getMessageController = async (req, res) => {
  try {
    const response = await getMessagePaginatedService(
        {
          channelId: req.params.channelId
        },
        req.query.page || 1,
        req.query.limit || 20,
        req.user
      );
    
      console.log('response', response);
      return res
        .status(StatusCodes.OK)
        .json(successResponse(response, 'message fetched successfully'));
  } catch (error) {
    console.log('getMessage controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }

};
