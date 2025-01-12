import { StatusCodes } from "http-status-codes"

import { createWorkspaceService, deleteWorkspaceById, getWorkspacesUserIsMemberOfService } from "../services/workspaceService.js"
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js"

export const createWorkspaceController = async(req, res) => {
    try {
        console.log('req.user', req.user);
        const response = await createWorkspaceService({
            ...req.body,
            owner: req.user
        })

        return res.status(StatusCodes.CREATED).json(successResponse(response, 'workspace created successfully'))
    } catch (error) {

        console.log('workspaceController error',error);

        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            internalErrorResponse(error)
        );
        
    }
}


export const getWorkspacesUserIsMemberOfController = async (req, res) => {
    try {
        const workspaces = await getWorkspacesUserIsMemberOfService(req.user);

    return res.status(StatusCodes.OK).json(
        successResponse(workspaces, 'workspaces fetched successfully')
    );
    } catch (error) {
        console.log(getWorkspacesUserIsMemberOfController, error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(
                customErrorResponse(error)
            );
        }

        return res.status(StatusCodes.BAD_REQUEST).json(
            internalErrorResponse(error)
        );
    }
}