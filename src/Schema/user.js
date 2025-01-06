import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: [true, 'Email already exists'],
            // eslint-disable-next-line no-useless-escape
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        }, 

        password: {
            type: String,
            required: [true, 'Password is required']
        },
         
        username: {
            type: String,
            required: [true, 'username is required'],
            unique: [true, 'username already exist'],
            match: [
                /^[a-zA-Z0-9]+$/,
                'username must contain only letter and numbers'
            ]
        },

        avatar: {
            type: String
        }
    },
    {timestamps: true}
);

userSchema.pre('save', function saveUser(next) {
    const user = this;
    user.avatar = `https://robohash.org/${user.username}`;
    next();
});

const user = mongoose.model('User', userSchema);

export default user;