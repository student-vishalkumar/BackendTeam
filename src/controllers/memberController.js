import { StatusCodes } from "http-status-codes";

import { isMemberPartOfWorkspaceService } from "../services/memberService.js";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js";

export const isMemberPartOfWorkspaceController = async (req, res) => {
  try {
    console.log('req.params.workspaceId', req.params.workspaceId)
    console.log('req.user', req.user);
    const response = await isMemberPartOfWorkspaceService(req.params.workspaceId,
        req.user
    );

    return res.status(StatusCodes.OK).json(
        successResponse(response, 'user is a member of workspace')
    );
  } catch (error) {
    console.log('isMemberPartOfWorkspaceController', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
