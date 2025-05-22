import { StatusCodes } from "http-status-codes";

import User from "../Schema/user.js";
import Workspace from "../Schema/workspace.js";
import ClientError from "../utils/error/ClientError.js";
import channelRepository from "./channelRepository.js";
import crudRepository from "./crudRepository.js";

const workspaceRepository = {
    ...crudRepository(Workspace),

    getWorkspaceDetailsById: async function(workspaceId) {
        const workspace = await Workspace.findById(workspaceId)
        .populate('members.memberId', 'username email avatar'
        ).populate('channels');

        return workspace;
    },

    getWorkspaceByName: async function(workspaceName) {
        const workspace = await Workspace.findOne(
            { name: workspaceName });

        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'workspace not find',
                statsCode: StatusCodes.NOT_FOUND
            });
        }
        return workspace;
    },

    getWorkspaceByJoinCode: async function(joinCode) {
        const workspace = await Workspace.findOne({ joinCode });

        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'workspace not found',
                statusCode: StatusCodes.NOT_FOUND 
            });
        }
        return workspace;
    },

    addMemberToWorkspace: async function(workspaceId, memberId, role){
        console.log('workspace id at addmemfun',workspaceId);
        const workspace = await Workspace.findById(workspaceId);

        console.log('workspace find', workspace);

        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'workspace not found',
                statusCode: StatusCodes.NOT_FOUND 
            });
        }

        console.log('memberid at add mem fun', memberId)

        const isValidUser = await User.findById(memberId);

        if(!isValidUser) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'user not found',
                statusCode: StatusCodes.NOT_FOUND 
            })
        }

        const isMemberAlreadyPartOfWorkspace = workspace.members.find( (member) => member.memberId == memberId);

        

        if(isMemberAlreadyPartOfWorkspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'member already part of workspace',
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        workspace.members.push({
            memberId,
            role
        });

        console.log('workspace after adding member', workspace);

        await workspace.save();

        return workspace;
    },

    addChannelToWorkspace: async function(workspaceId, channelName) {
        const workspace = await Workspace.findById(workspaceId).populate('channels');

        if(!workspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'workspace not found',
                statusCode: StatusCodes.NOT_FOUND
            });
        };

        // const isValidChannel = await Channel.findById(channelName);

        // if(!isValidChannel) {
        //     throw new ClientError({
        //         explanation: 'Inavlid data sent from the client',
        //         message: 'channel not found',
        //         statusCode: StatusCodes.NOT_FOUND
        //     });
        // };

        const isChannelAlreadyPartOfWorkspace = workspace.channels.find((channel) => channel.name === channelName);

        if(isChannelAlreadyPartOfWorkspace) {
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'channel is already present in the workspace',
                statusCode: StatusCodes.FORBIDDEN
            });
        };

        const channel = await channelRepository.create({
            name: channelName,
            workspaceId: workspaceId
          });

        workspace.channels.push(channel);

        await workspace.save();

        return workspace;
    },

    fetchAllWorkspaceByMemberId: async function (memberId) {
        const workspaces = Workspace.find({
          'members.memberId': memberId
        }).populate('members.memberId', 'username email avatar');
        return workspaces;
    },

    removeMemberFromWorkspace: async function(workspaceId, memberId) {
        const workspace = await Workspace.findById(workspaceId);

        console.log('wsAtRepo', workspace)
        if(!workspace) {
            throw new ClientError({
                message: "Workspace not found",
                explanation: "Invalid data sent from the User",
                statsCode: StatusCodes.NOT_FOUND
            })
        }

        const exitMember = workspace.members.find((member) => member.memberId.toString() === memberId.toString());

        console.log('exitMember', exitMember);

        if(!exitMember) {
            throw new ClientError({
                message: "User is not is part the workspace",
                explanation: "Invalid data sent from the User",
                statsCode: StatusCodes.NOT_FOUND
            })
        }

        workspace.members = workspace.members.filter((member) => member.memberId.toString() !== memberId.toString());

        console.log('ws member', workspace.members)

        await workspace.save();

        return workspace;
    }
}

export default workspaceRepository;