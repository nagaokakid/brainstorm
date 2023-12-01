import Idea from "../../models/Idea";
import VoteResult from "./VoteResult";

interface prop {
  ideas: Idea[];
}
const VoteResults = (props: prop) => {
  return (
    <div>
      {props.ideas.map((x) => (
        <VoteResult idea={x} />
      ))}
    </div>
  );
};

export default VoteResults;
