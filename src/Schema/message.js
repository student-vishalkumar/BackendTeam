import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        body: {
            type: String,
            required: [true, 'body is required']
        },

        image: {
            type: String,
        },

        channelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel',
            required: [true, 'channel Id is required']
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'sender Id is required']
        },

        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: [true, 'workspace Id is required']
        }
    },
    {timestamps: true}
)

const Message = mongoose.model('Message', messageSchema);

export default Message;