export enum ErrorMessages {
    Empty = "",
    FormIncomplete = "Please fill in all the fields",
    AccountNotFound = "Account not found",
    FailedToLogin = "Failed to login",
    FailedToRegister = "Failed to register",
    PasswordNotMatch = "Passwords do not match",
    DuplicatedAccount = "Account already exists",
    InvalidCode = "Invalid code",
    FailedToCreateBSsession = "Failed to create BS session",
    DeleteAccountFailed = "Failed to delete account",
    DeleteChatRoomFailed = "Failed to delete chat room",
    EditAccountFailed = "Failed to update account info",
    EditChatRoomFailed = "Failed to update chat room info",
    NameEmpty = "Name cannot be empty",
    TitleEmpty = "Title cannot be empty",
}

export enum NoticeMessages {
    Empty = "",
    FeatureRestricted = "This feature is restricted to guest users",
    SessionEnded = "Session ended",
    AlreadyInChatRoom = "You are already in this chat room",
}

export enum TabTypes {
    LoginTab = "tab1",
    RegisterTab = "tab2",
    ChatRoom = "ChatRoom List",
    DiretMessage = "Direct Message List",
}

export enum DisplayTypes {
    None = "none",
    Block = "block",
    Flex = "flex",
}

export enum KeyDown {
    Enter = "Enter",
    NumpadEnter = "NumpadEnter",
}