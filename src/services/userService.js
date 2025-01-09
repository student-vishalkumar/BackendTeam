import userRepository from '../repositories/userRepository.js';
import ValidationError from '../utils/error/validationError.js';

export const signupUserService = async (data) => {
    try {
        const newUser = await userRepository.create(data);
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