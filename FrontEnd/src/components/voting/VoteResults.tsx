import Idea from "../../models/Idea";
import VoteResult from "./VoteResult";

/*
 * VoteResults.tsx 
 * -------------------------
 * This component is the idea list of the voting page.
 * -----------------------------------------------------------------------
 * Author:  Mr. Roland Fehr
 * Date Created:  01/12/2023
 * Last Modified: 01/12/2023
 * Version: 1.0
*/ 
interface prop {
  ideas: Idea[];
}
const VoteResults = (props: prop) => {
  return (
    <div>
      <div className="VoteResults_Heading">Vote Results</div>
      {props.ideas.map((x) => (
        <VoteResult idea={x} />
      ))}
    </div>
  );
};

export default VoteResults;
