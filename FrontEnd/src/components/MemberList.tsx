import { useEffect, useState } from "react";
import { DisplayTypes, KeyDown, NoticeMessages } from "../models/EnumObjects";
import { userInfoObject } from "../models/TypesDefine";
import SignalRDirect from "../services/DirectMessageConnection";
import UserInfo from "../services/UserInfo";
import "../styles/MemberList.css";
import UserProfile from "./UserProfile";

/*
 * MemberList.tsx
 * -------------------------
 * This component is the member list of the chat room.
 * -----------------------------------------------------------------------
 * Authors:  Ravdeep Singh
 * Date Created:  01/12/2023
 * Last Modified: 01/12/2023
 * Version: 1.0
 */
interface MemberListProps {
    memberList: userInfoObject[] | null;
}

function MemberList(props: MemberListProps) {
    const onlineMembers = props.memberList ?? [];
    const [input, setInput] = useState<string>(""); // The input of the user to send direct message
    const [showInput, setShowInput] = useState<number>(-1); // Show the input box when the user clicks on a member

    /**
     * Handle the click event of a member
     * @param id The id of the member
     * @param name The name of the member
     * @returns 
     */
    function handleMemberClick(member: userInfoObject, index: number) {

        if (UserInfo.getUserInfo().isGuest) { // If the user is a guest, do not allow them to send direct message
            alert(NoticeMessages.FeatureRestricted);
            return;
        } else if (UserInfo.getUserInfo().userId == member.userId) {
            return;
        } else {
            if (showInput == index) {
                setShowInput(-1);
                return;
            }
            setShowInput(index);
        }
    }

    /**
     * Handle the send direct message
     * @param member The member to send the direct message to
     * @returns 
     */
    async function handleSendDM(member: userInfoObject) {
        if (input == "") {
            return;
        } else if (input.trim() != "") {
            const msg = {
                user1: UserInfo.getUserInfo(),
                user2:
                {
                    userId: member.userId,
                    firstName: member.firstName,
                    lastName: member.lastName,
                },
                message: input,
            }
            await SignalRDirect.getInstance().then(async (value) => await value.sendMessage(msg));
        }

        setInput("");
        setShowInput(-1);
    }

    /**
     * Handle the changes of the input
     * @param e 
     */
    function handleChanges(e: React.ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
    }

    /**
     * Prevent the child from being clicked
     * @param e 
     */
    function handleChildClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    /**
     * This will handle the enter key press
     * @param value
     */
    function handleKey(value: React.KeyboardEvent<HTMLInputElement>) {
        if (value.code === KeyDown.Enter || value.code === KeyDown.NumpadEnter) { // Detect if the key pressed is the enter key or the numpad enter key
            handleSendDM(onlineMembers[showInput]);
        }
    }

    useEffect(() => {
        setShowInput(-1);
        setInput("");
    }, [props.memberList]);

    return (
        <div className="ChatMemberList">
            <h2 className="MemberListTitle">Members</h2>
            <div className="HorizontalLine"></div>
            <div className="MembersList">
                <ul className="Members">
                    {onlineMembers.map((member, index) => (
                        <li key={index} onClick={() => handleMemberClick(member, index)}>
                            <UserProfile user={member} />
                            <div className="InputContainer" style={showInput == index ? { display: DisplayTypes.Flex } : { display: DisplayTypes.None }} onClick={handleChildClick}>
                                <form className="DMInputForm" id="DMInputForm" onSubmit={(e) => e.preventDefault()}>
                                    <input className="DMInput" type="text" id="DMInput" autoComplete="off" placeholder={`@ to ${member.firstName + member.lastName}`} value={input ?? ""} onChange={handleChanges} onKeyDown={handleKey} />
                                </form>
                                <button onClick={() => handleSendDM(member)}>Send</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MemberList;
