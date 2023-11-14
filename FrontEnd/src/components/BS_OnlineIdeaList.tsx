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
            {props.content.map((idea, id) => {
                return (
                    props.voting ?
                        <VoteIdea idea={idea} key={id}/>
                        :
                        <VoteResult idea={idea} key={id} />
                );
            })}
        </div>
    );
}

export default BS_OnlineIdeaList;