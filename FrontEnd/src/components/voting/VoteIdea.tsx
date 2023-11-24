import '../../styles/VoteIdea.css'
import Idea from '../../models/Idea'
import UserInfo from '../../services/UserInfo'

interface props {
    idea: Idea
}

const VoteIdea = ({ idea }: props) => {
    function clickedLike() {
        UserInfo.addLikes(idea.id)
    }

    function clickedDislike() {
        UserInfo.addDislikes(idea.id)
    }

    return (
        <div className='IdeaBox'>
            <div className='IdeaThought'>{idea.thought}</div>
            <div className='IdeaButton'>
                <button className='LikeIdea' onClick={clickedLike}>
                    <img src='src\assets\like.png' height={20}/>
                </button>
                <button className='DislikeIdea' onClick={clickedDislike}>
                    <img src='src\assets\dislike.png' height={20}/>
                </button>
            </div>
        </div>
    )
}

export default VoteIdea