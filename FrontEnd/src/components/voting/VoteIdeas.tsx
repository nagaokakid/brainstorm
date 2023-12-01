import Idea from "../../models/Idea";
import VoteIdea from "./VoteIdea";

interface props {
  ideas: Idea[];
}

const VoteIdeas = ({ ideas }: props) => {
  return <div>
    {
        ideas.map(x=><VoteIdea idea={x}/>)
    }
    </div>;
};

export default VoteIdeas;
