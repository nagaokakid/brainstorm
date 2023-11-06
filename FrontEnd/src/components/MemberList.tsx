import "../styles/MemberList.css";
import UserInfo from "../services/UserInfo";
import SignalRDirect from "../services/DirectMessageConnection";
import { userInfoObject } from "../services/TypesDefine";

interface MemberListProps {
    memberList: userInfoObject[] | null;
}

/**
 * 
 * @param {*} memberList The list of members to be displayed 
 * @returns 
 */
function MemberList(props: MemberListProps) {

    const onlineMembers = props.memberList ?? []

    function handleMemberClick(id: string, name: string) {
        const temp = prompt("Enter your message to " + name);

        if (!temp) return;

        const msg = {
            "user1": UserInfo.getCurrentFriendlyUserInfo(),
            "user2":
            {
                "userId": id,
                "firstName": name,
                "lastName": name
            },
            "message": temp,
        }

        SignalRDirect.getInstance().then(async (value) => await value.sendMessage(msg));
    }

    return (
        <div className="member-list">
            <div className="online-members">
                <h2>Online Members</h2>
                <ul>
                    {onlineMembers.map((member, index) => (
                        <li key={index} onClick={() => handleMemberClick(member.userId, member.firstName)}>{member.firstName}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MemberList;
