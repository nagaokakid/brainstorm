import "../styles/MemberList.css";

function MemberList()
{
  const onlineMembers = ["Member 1", "Member 2", "Member 3"];
  const offlineMembers = ["Member 4", "Member 5", "Member 6"];
  return (
    <div className="member-list">
      <div className="online-members">
        <h2>Online Members</h2>
        <ul>
          {onlineMembers.map((member, index) => (
            <li key={index}>{member}</li>
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
