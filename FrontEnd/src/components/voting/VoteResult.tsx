import React from "react";
import Idea from "../../models/Idea";
interface prop {
  idea: Idea;
}
const VoteResult = ({ idea }: prop) => {
  return (
    <div>
      <div>${idea.thought}</div>
      <div>
        <div>Likes: ${idea.likes}</div>
        <div>Dislikes: ${idea.dislikes}</div>
      </div>
    </div>
  );
};

export default VoteResult;
