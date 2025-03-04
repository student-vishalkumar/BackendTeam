import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/serverConfig.js";
import userRepository from "../repositories/userRepository.js";
import { customErrorResponse, internalErrorResponse } from "../utils/common/responseObject.js";

export const isAuthenticated = async (req, res, next) => {
    try {

        console.log('req', req.headers['x-access-token']);
        const token = req.headers['x-access-token'];
        console.log('token in md', token);
        if(!token) {
            return res.status(StatusCodes.FORBIDDEN).json(customErrorResponse(
                {
                    explanation: "data is not sent",
                    message: 'token is required'
                }
            ))
        }

        const response = jwt.verify(token, JWT_SECRET);

        if(!response) {
            return res.status(StatusCodes.FORBIDDEN).json(
                customErrorResponse(
                    {
                        explanation: 'Invalid data sent from the user',
                        message: 'Valid token required'
                    }
                )
            )
        }

        const user = await userRepository.getById(response.id);
    
        req.user = user.id;
        next();
    } catch (error) {
        console.log('isAuth error', error);

        if(error.name === 'jsonWebTokenError'|| error.name === 'TokenExpiredError') {
            return res.status(StatusCodes.FORBIDDEN).json(
                customErrorResponse(
                    {
                        explanation: 'Invalid data sent from the client',
                        message: 'invalid token provided'
                    }
                )
            )
        }

        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
            internalErrorResponse(error)
        );
    }
}
