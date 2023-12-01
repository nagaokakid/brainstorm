import { friendlyUser } from "./FriendlyUser"

/* 
 * TypesDefine.ts
 * -----------------------------
 * This file is the model for the TypesDefine object.
 * ----------------------------------------------------------
 * Author:  Mr. Yee Tsuung (Jackson) Kao and Mr. Roland Fehr
 * Date Created:  01/12/2023
 * Last Modified: 01/12/2023
 * Version: 0.0.1
*/

export type user = {
    userInfo: userInfoObject,
    token: string,
    chatRooms: chatRoomObject[],
    directMessages: directMessageObject[],
}

export type loginObject = {
    Username: string,
    Password: string,
    RePassword?: string,
    FirstName?: string,
    LastName?: string,
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
    bs_session?: brainstormDTO[]
}

export type chatRoomMessageObject = {
    messageId: string,
    fromUserInfo: userInfoObject,
    toUserInfo?: userInfoObject,
    chatRoomId: string,
    message: string,
    timestamp: string,
    brainstorm?: brainstormDTO
}

export type directMessageObject = {
    user1: userInfoObject,
    user2: userInfoObject,
    directMessages: {messageId:string, message: string, timestamp: string }[]
}

export type newDirectMessageObject = {
    messageId: string,
    fromUserInfo: userInfoObject,
    toUserInfo: userInfoObject,
    message: string,
    timestamp: string
}

export type sendMessageObject = {
    user1: userInfoObject,
    user2: userInfoObject,
    message: string
}

export type brainstormDTO = {
    sessionId: string;
    title: string;
    description: string;
    timer: number; // to be received in seconds
    creator: friendlyUser;
    members: friendlyUser[];
}