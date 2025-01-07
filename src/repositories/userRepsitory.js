import User from './Schema/user.js'

import crudRepository from './crudRepository.js';

const userRepository = {
    ...crudRepository,

    getByEmail: async function (email) {
        const user = await User.findOne({ email });
        return user;
    },

    getByUsername: async function (username) {
        const user = await User.findOne({ username }).select('-password'); // exclude password
    }
}