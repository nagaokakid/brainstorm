/*
* TypesDefine.ts
* -----------------------------
* This file is the model for the TypesDefine object.
* ----------------------------------------------------------
* Author:  Mr. Yee Tsuung (Jackson) Kao and Mr. Roland Fehr
*/

export type userObject = {
    userInfo: userInfoObject,
    token: string,
    chatRooms: chatRoomObject[],
    directMessages: directMessageObject[],
}

export type loginObject = {
    username: string,
    password: string,
    rePassword?: string,
    firstName?: string,
    lastName?: string,
}

export type userInfoObject = {
    userId: string,
    firstName: string,
    lastName: string,
    isGuest?: boolean,
    firstRoom?: string,
}

export type chatRoomObject = {
    id: string,
    title: string,
    description: string,
    joinCode: string,
    messages: chatRoomMessageObject[],
    members: userInfoObject[],
    bs_session?: brainstormDTO[],
}

export type chatRoomMessageObject = {
    messageId: string,
    fromUserInfo: userInfoObject,
    toUserInfo?: userInfoObject,
    chatRoomId: string,
    message: string,
    timestamp: string,
    brainstorm?: brainstormDTO,
}

export type directMessageObject = {
    user1: userInfoObject,
    user2: userInfoObject,
    directMessages: { fromUserId: string, messageId: string, message: string, timestamp: string }[],
}

export type newDirectMessageObject = {
    messageId: string,
    fromUserInfo: userInfoObject,
    toUserInfo: userInfoObject,
    message: string,
    timestamp: string,
}

export type sendMessageObject = {
    user1: userInfoObject,
    user2: userInfoObject,
    message: string,
}

export type brainstormDTO = {
    sessionId: string,
    title: string,
    description: string,
    timer: number,
    creator: userInfoObject,
    members: userInfoObject[],
}