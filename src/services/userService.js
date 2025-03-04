import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import { ENABLE_EMAIL_VERIFICATION } from '../config/serverConfig.js';
import { addEmailtoMailQueue } from '../producers/mailQueueProducer.js';
import userRepository from '../repositories/userRepository.js';
import { createJWT } from '../utils/common/authUtils.js';
import { verifyEmailMail } from '../utils/common/mailObject.js';
import ClientError from '../utils/error/ClientError.js';
import ValidationError from '../utils/error/validationError.js';

export const signupUserService = async (data) => {
    try {
        const newUser = await userRepository.signupUser(data);
        console.log('trigred1')
        
        console.log("env",ENABLE_EMAIL_VERIFICATION)
        
        if (ENABLE_EMAIL_VERIFICATION) {
            // send verification email
            console.log('triggerd');
            addEmailtoMailQueue({
                ...verifyEmailMail(newUser.verificationToken),
                to: newUser.email
            })
        }
        return newUser;
    } catch(error) {
        console.log('user service error', error);
        if(error.name === 'ValidationError') {
            throw new ValidationError(
                {
                    error: error.errors
                },
                error.message
            );
        }

        if(error.name === 'MongoServerError' && error.code === 11000) {
            throw new ValidationError(
                {
                    error: ['A user with same email or same username already exists']
                },
                'A user with same email or same username already exists'
            )
        }
    }
}


export const signinUserService = async (data) => {

    try {
    const user = await userRepository.getByEmail(data.email);

    if(!user) {
        throw new ClientError({
            explanation: 'Invalid data sent from user',
            message: 'User with this email is not exist',
            statusCode: StatusCodes.BAD_REQUEST
        });
    }

    const isPassword = bcrypt.compareSync(data.password, user.password);

    if(!isPassword) {
        throw new ClientError({
            explanation: 'Invalid data sent from user',
            message: 'Invalid password, please try again',
            statusCode: StatusCodes.BAD_REQUEST
        });
    }

    return {
        username: user.username,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
        token: createJWT({ id: user._id, email: user.email})
    }

    } catch(error) {
        console.log('signin service error', error);
        throw error;
    }
}


export const verifyTokenService = async (token) => {
    try {
        console.log('tokens', token)
        const user = await userRepository.getByToken(token);

        console.log('user', user)
        if(!user) {
            throw new ClientError({
                explanation: 'Invalid data sent from the user',
                message: 'Invalid Token',
                statusCode: StatusCodes.BAD_REQUEST
            })
        }

        if(user.verificationTokenExpiry < Date.now()) {
            throw new ClientError({
                explanation: 'Invalid data sent for the client',
                message: 'emial verification token is expired',
                statusCode: StatusCodes.UNAUTHORIZED
            })
        }

        user.isVerified = true;

        user.verificationToken = null;

        user.verificationTokenExpiry = null;

        await user.save();

        return user;
    } catch (error) {
        console.log('verifyTokenService error', error);
        throw error;
    }
}