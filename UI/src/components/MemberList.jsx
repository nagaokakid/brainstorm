/* eslint-disable react/prop-types */
import "../styles/MemberList.css";
import AppInfo from "../services/AppInfo";
import SignalRDirect from "../services/DirectMessageConnection";

/**
 * 
 * @param {*} memberList The list of members to be displayed 
 * @returns 
 */
function MemberList(props)
{
  const onlineMembers = props.memberList ?? ["Empty"];
  const offlineMembers = ["Member 4", "Member 5", "Member 6"];

  function handleMemberClick(id, name)
  {
    var temp = prompt("Enter your message to "+name);

    const msg = () =>
    {
      return {
        "user1":AppInfo.getCurrentFriendlyUserInfo(),
        "user2":
                {
                    "userId": id,
                    "firstName": name,
                    "lastName": name
                },

        "messages": [
            {
                "message": temp
            }
        ],
      }
    }

    SignalRDirect.getInstance().then( async (value) => await value.sendMessage(msg()));
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
      <div className="offline-members">
        <h2>Offline Members</h2>
        <ul>
          {offlineMembers.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MemberList;
