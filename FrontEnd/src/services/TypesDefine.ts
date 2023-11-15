import {friendlyUser} from "../models/FriendlyUser"

export type userInfoObject = {
    userId: string,
    firstName: string,
    lastName: string,
    isGuest?: boolean,
    firstRoom?: string
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
    fromUserInfo: userInfoObject,
    chatRoomId: string,
    message: string,
    timestamp: string,
    brainstorm?: brainstormDTO
}

export type directMessageObject = {
    user1: userInfoObject,
    user2: userInfoObject,
    directMessages: { message: string, timestamp: string }[]
}

export type newDirectMessageObject = {
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
    timer: number; // to be received in ms
    creator: friendlyUser;
    members: friendlyUser[];
}