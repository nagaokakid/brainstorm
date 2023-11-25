import "../styles/MemberList.css";
import UserInfo from "../services/UserInfo";
import SignalRDirect from "../services/DirectMessageConnection";
import { userInfoObject } from "../models/TypesDefine";
import UserProfile from "./UserProfile";

interface MemberListProps {
    memberList: userInfoObject[] | null;
}

function MemberList(props: MemberListProps) {
    const onlineMembers = props.memberList ?? [];

    /**
     * Handle the click event of a member
     * @param id The id of the member
     * @param name The name of the member
     * @returns 
     */
    function handleMemberClick(member: userInfoObject) {

        if (UserInfo.getUserInfo().isGuest) { // If the user is a guest, do not allow them to send direct message
            alert("Guest cannot send direct message");
            return;
        } else {
            const temp = prompt("Enter your message to " + member.firstName + " " + member.lastName);

            if (!temp) {
                return
            } else {
                const msg = {
                    "user1": UserInfo.getUserInfo(),
                    "user2":
                    {
                        "userId": member.userId,
                        "firstName": member.firstName,
                        "lastName": member.lastName,
                    },
                    "message": temp,
                }

                SignalRDirect.getInstance().then(async (value) => await value.sendMessage(msg));
            }
        }
    }

    return (
        <div className="member-list">
            <div className="online-members">
                <h2>Members</h2>
                <ul>
                    {onlineMembers.map((member, index) => (
                        <li key={index} onClick={() => handleMemberClick(member)}><UserProfile user={member}/></li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MemberList;
