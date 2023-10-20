/* eslint-disable react/prop-types */
import AppInfo from "../services/appInfo";
import SignalRDirect from "../services/directMessageConnection";
import "../styles/MemberList.css";

function MemberList(props)
{
  const onlineMembers = props.memberList ?? ["Member 1", "Member 2", "Member 3"];
  const offlineMembers = ["Member 4", "Member 5", "Member 6"];

  function handleMemberClick(id, name)
  {
    var temp = prompt("Enter your message to "+name);

    const msg = () =>
    {
      return {
        "User1":AppInfo.getCurrentFriendlyUserInfo(),
        "User2":
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

    SignalRDirect.getInstance().then(value => value.sendMessage(msg()));
    console.log("---> first");
    AppInfo.addNewDirectMessage(msg());
    console.log(AppInfo.getDirectMessagesList(), "here is the list");
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
