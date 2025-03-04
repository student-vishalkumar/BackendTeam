import User from '../Schema/user.js'
import crudRepository from './crudRepository.js';

const userRepository = {
    ...crudRepository(User),

    signupUser: async function (data) {
        const newUser = new User(data);
        await newUser.save();

        return newUser;
    },

    getByEmail: async function (email) {
        const user = await User.findOne({ email });
        return user;
    },

    getByUsername: async function (username) {
        const user = await User.findOne({ username }).select('-password'); // exclude password
        return user;
    },

    getByToken: async function(token) {
        console.log('tokenr',typeof token)
        const user = await User.findOne({verificationToken: token})
        console.log('users', user);
        return user;
    }
}

export default userRepository;
