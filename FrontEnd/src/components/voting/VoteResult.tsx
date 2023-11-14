import '../../styles/VoteResult.css';
import Idea from "../../models/Idea";

interface prop {
    idea: Idea;
}

const VoteResult = ({ idea }: prop) => {
    return (
        <div className='IdeaResultBox'>
            <div className='IdeaThought'>${idea.thought}</div>
            <div className='IdeaButton'>
                <div>Likes: ${idea.likes}</div>
                <div>Dislikes: ${idea.dislikes}</div>
            </div>
        </div>
    );
};

export default VoteResult;
