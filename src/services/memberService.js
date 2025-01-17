import { StatusCodes } from "http-status-codes";

import userRepository from "../repositories/userRepository.js";
import workspaceRepository from "../repositories/workspaceRepository.js"
import ClientError from "../utils/error/ClientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const isMemberPartOfWorkspaceService = async(workspaceId, memberId) => {
    // try {
        console.log('workspaceId', workspaceId)
        const workspace = await workspaceRepository.getById(workspaceId);
        console.log('workspace',workspace)
        const isUserAMember = isUserMemberOfWorkspace(workspace, memberId);

        if(!isUserAMember) {
            throw new ClientError({
                explanation: 'User is not a member of a workspace',
                message: 'User is not a member of a workspace',
                statusCode: StatusCodes.UNAUTHORIZED
            })
        }

        const user = await userRepository.getById(memberId);

        return user;
    // } catch (error) {

    //     console.log('isMemberPartOfWorkspace service', error);
    //     throw error;
        
    // }
}