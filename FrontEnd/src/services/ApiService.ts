import Idea from "../models/Idea";
import {
  chatRoomMessageObject,
  chatRoomObject,
  loginObject,
  newDirectMessageObject,
} from "../models/TypesDefine";
import SignalRChatRoom from "./ChatRoomConnection";
import SignalRDirect from "./DirectMessageConnection";
import UserInfo from "./UserInfo";

/*
 * ApiService.ts
 * -----------------------------
 * This file is the model for the ApiService object.
 * ----------------------------------------------------------
 * Author:  Mr. Yee Tsuung (Jackson) Kao and Mr. Roland Fehr
 * Date Created:  01/12/2023
 * Last Modified: 01/12/2023
 * Version: 0.0.1
 */

/// <summary>
/// This class is the model for the ApiService object.
/// </summary>
class ApiService {
  /**
   * Do a Login API call to the backend and connect to all chatrooms and direct messaging
   * @param {*} loginInfo The login object that contains the username and password
   * @returns boolean that indicates if the login is successful
   */
  async Login(loginInfo: loginObject) {
    const resp = await fetch(UserInfo.BaseURL + "api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: loginInfo.Username,
        Password: loginInfo.Password,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          UserInfo.setCurrentUser(await response.json()); // set current user
          UserInfo.updateUser(true); // update user info to session storage
          UserInfo.setToken(); // set token to session storage
          await this.connectChatRooms();
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return null;
      });

    return resp;
  }

  /**
   * Do a Register API call to the backend and connect to direct messaging
   * @param {*} registerInfo The register object that contains the username, password, first name and last name
   * @returns boolean that indicates if the register is successful
   */
  async Register(registerInfo: loginObject) {
    const resp = await fetch(UserInfo.BaseURL + "api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: registerInfo.Username,
        Password: registerInfo.Password,
        FirstName: registerInfo.FirstName,
        LastName: registerInfo.LastName,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          UserInfo.setCurrentUser(await response.json()); // set current user
          UserInfo.updateUser(true); // update user info to session storage
          UserInfo.setToken(); // set token to session storage
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return null;
      });

    return resp;
  }

  /**
   * Do a delete account API call to the backend
   * @returns boolean that indicates if the account is deleted
   */
  async DeleteUser() {
    const result = await fetch(UserInfo.BaseURL + "api/users/" + UserInfo.getUserId(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + UserInfo.getToken(),
      },
    }).then(async (response) => {
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    });

    return result;
  }

  async LeaveChatRoom(chatRoomId: string) {
    const result = await fetch(UserInfo.BaseURL + "api/chatroom", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + UserInfo.getToken(),
      },
      body: JSON.stringify({
        userId: UserInfo.getUserId(),
        chatRoomId: chatRoomId
      }),
    }).then(async (response) => {
      if (response.ok) {
        UserInfo.leaveChatRoom(chatRoomId)
        return true;
      } else {
        return false;
      }
    });

    return result;
  }

  async EditChatRoom(
    chatRoomId: string,
    newTitle: string,
    newDescription: string,
  ) {
    const result = await fetch(UserInfo.BaseURL + "api/chatroom/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + UserInfo.getToken(),
      },
      body: JSON.stringify({
        id: chatRoomId,
        title: newTitle,
        description: newDescription
      }),
    }).then(async (response) => {
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    });

    return result;
  }

  async EditUser(
    newUsername: string,
    newPassowrd: string,
    newFirstName: string,
    newLastName: string
  ) {
    const result = await fetch(UserInfo.BaseURL + "api/users/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + UserInfo.getToken(),
      },
      body: JSON.stringify({
        username: newUsername,
        password: newPassowrd,
        userId: UserInfo.getUserId(),
        firstName: newFirstName,
        lastName: newLastName,
      }),
    }).then(async (response) => {
      if (response.ok) {
        UserInfo.setFirstName(newFirstName);
        UserInfo.setLastName(newLastName);
        return true;
      } else {
        return false;
      }
    });
    return result;
  }

  /**
   * Do a CreateChatRooms API call to the backend and build the connection to the chat room
   * @param {*} title The chat room name or title
   * @param {*} description The chat room description
   * @returns A json object that contains the response from the backend
   */
  async CreateChatRoom(title: string, description: string | null | undefined) {
    const resp = await fetch(UserInfo.BaseURL + "api/chatroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + UserInfo.getToken(),
      },
      body: JSON.stringify({
        userId: UserInfo.getUserId(),
        title: title,
        description: description,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          const data: chatRoomObject = (await response.json())["chatRoom"];
          UserInfo.addNewChatRoom(data);
          await this.connectChatRoom(data.joinCode);
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return null;
      });

    return resp;
  }

  /**
   * Do a check if the join code is valid
   * @param joinCode The join code of the chatroom
   * @returns boolean that indicates if the join code is valid
   */
  async IsJoinCodeValid(joinCode: string) {
    const resp = await fetch(UserInfo.BaseURL + "api/chatroom/" + joinCode, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        return null;
      });

    return resp;
  }

  /**
   * Build the connection to the backend for each chatroom
   */
  async connectChatRooms() {
    const connection = await SignalRChatRoom.getInstance();
    const chatRooms = UserInfo.getChatRoomsList();

    // Build connection only if there are chatrooms
    if (chatRooms) {
      for (let index = 0; index < chatRooms.length; index++) {
        const element = chatRooms[index];
        await connection.joinChatRoom(element.joinCode, "Second");
      }
    }
  }

  /**
   * Build the connection to the backend for a specific chatroom
   * @param {*} joinCode The join code of the chatroom
   */
  async connectChatRoom(joinCode: string) {
    const connection = await SignalRChatRoom.getInstance();
    await connection.joinChatRoom(joinCode, "Second");
  }

  /**
   * Set all the call back functions for the SignalR
   * @param {*} Callback A function that will be called when a message is received
   */
  async buildCallBack(
    Callback: (
      type: number,
      bsid?: string,
      msgObject?: chatRoomMessageObject | { fromUserId: string; messageId: string; message: string; timestamp: string },
      userId?: string,
      count?: number,
      timer?: number,
    ) => void
  ) {
    /**
     * Set all the call back functions for the SignalR
     */
    await SignalRDirect.getInstance().then((value) => {
      value.setReceiveDirectMessageCallback((msgObject: newDirectMessageObject) => {
        Callback(2, undefined, {
          fromUserId: msgObject.fromUserInfo.userId,
          messageId: msgObject.messageId,
          message: msgObject.message,
          timestamp: msgObject.timestamp
        });
      });
      value.setRemoveDirectMessageCallback((toId: string, messageId: string) => {
        if (toId && messageId) {
          UserInfo.deleteDirectMessage(toId, messageId);
          Callback(7);
        }
      });
    });

    /**
     * Set all the call back functions for the SignalR
     */
    await SignalRChatRoom.getInstance().then((value) => {
      value.setReceiveChatRoomMessageCallback(
        (
          bsid: string | undefined,
          msgObject: chatRoomMessageObject,
          timer?: number
        ) => {
          Callback(1, bsid, msgObject, undefined, undefined, timer);
        }
      );
      value.setReceiveChatRoomInfoCallback(() => {
        Callback(4);
      });
      value.setReceiveNewMemberCallback(() => {
        Callback(3);
      });
      value.setRemoveChatRoomMessageCallback((chatRoomId: string, messageId: string) => {
        if (chatRoomId && messageId) {
          UserInfo.deleteChatRoomMessage(chatRoomId, messageId);
          Callback(7);
        }
      });
      value.setUserJoinedBrainstormSessionCallback((id, userId, count, timer) => {
        Callback(5, id, undefined, userId, count, timer);
      });
      value.setBrainstormSessionAlreadyStartedErrorCallback(() => {
        Callback(6);
      });
      value.setEditChatRoomCallback(() => {
        Callback(8);
      });
      value.setRemoveJoinBSMessage((chatRoomId: string, sessionId: string) => {
        if (chatRoomId && sessionId) {
          UserInfo.deleteChatRoomMessageBySessionId(chatRoomId, sessionId);
          Callback(7);
        }
      });
    });
  }

  async buildBSCallBack(
    Callback: (
      type: number,
      ideas?: Idea[],
      session_Id?: string,
      timer?: number
    ) => void
  ) {
    await SignalRChatRoom.getInstance().then((value) => {
      value.setBrainstormSessionStartedCallback((sessionId: string, timer: number) => {
        console.log("----> Receive BS started message callback");
        Callback(1, undefined, sessionId, timer);
      });
      value.setBrainstormSessionEndedCallback(() => {
        console.log("----> Receive BS ended message callback");
        Callback(2);
      });
      value.setReceiveAllIdeasCallback((id: string, ideas: Idea[]) => {
        console.log("----> Receive BS idea receive message callback");
        Callback(3, ideas);
      });
      value.setReceiveVoteResultsCallback((id: string, ideas: Idea[]) => {
        console.log("----> Receive BS vote results message callback");
        Callback(4, ideas);
      });
      value.setSendVotesCallback(() => {
        console.log("----> Receive BS send vote message callback");
        Callback(5);
      });
    });
  }

  async leaveBSSession(creator: string, sessionId: string, started?: boolean) {
    await SignalRChatRoom.getInstance().then(async (value) => {
      if (started) {
        if (UserInfo.isHost(creator)) {
          await value.removeSession(sessionId);
        } else {
          await value.removeUserFromBrainstormSession(sessionId);
        }
      } else {
        await value.removeUserFromBrainstormSession(sessionId);
      }
      value.removeBSCallBack();
    });
  }
}

export default new ApiService();
