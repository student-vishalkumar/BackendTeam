import { StatusCodes } from "http-status-codes";

import { signinUserService, signupUserService } from "../services/userService.js"
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObject.js";

export const signup = async(req, res) => {
    try {
        const user = await signupUserService(req.body);
        return res
        .status(StatusCodes.CREATED)
        .json(successResponse(user, 'user created successfully'));
    } catch(error) {
        console.log('user controller signup error',error);
        if(error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));    
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            internalErrorResponse(error)
        );
    }
}

export const signin = async (req, res) => {
    try {
        const response = await signinUserService(req.body);;
        return res
        .status(StatusCodes.OK)
        .json(successResponse(response, 'user signin successfully'));
    } catch (error) {
        console.log('user controller signin error', error);
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