import { APP_LINK, MAIL_ID } from "../../config/serverConfig.js"

export const workspaceJoinMail = function (workspace) {
    return {
        
            from: MAIL_ID,
            subject: 'You have been added to workspace',
            text: `Congratulations! You have been added to the workspace ${workspace.name}`
        
    }
}

export const verifyEmailMail = function (verificationToken) {
    return {
        from: MAIL_ID,
        subject: 'Verify your email by clicking below link',
        text: `Welcome to the app please verify your email
        ${APP_LINK}/verify/${verificationToken}`
    }
}