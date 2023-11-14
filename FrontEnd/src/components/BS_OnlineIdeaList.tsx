import '../styles/BS_OnlineIdeaList.css';
import VoteIdea from './voting/VoteIdea';
import VoteResult from './voting/VoteResult';
import Idea from '../models/Idea';

interface BS_OnlineIdeaListProps {
    content: Idea[],
    voting: boolean,
}

function BS_OnlineIdeaList(props: BS_OnlineIdeaListProps) {

    return (
        <div className="OnlineIdeasContainer">
            {props.content.map((idea) => {
                return (
                    props.voting ?
                        <VoteIdea idea={idea} />
                        :
                        <VoteResult idea={idea} />
                );
            })}
        </div>
    );
}

export default BS_OnlineIdeaList;