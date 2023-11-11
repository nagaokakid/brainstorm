import React from 'react'
import Idea from '../../models/Idea'

interface props {
    idea: Idea
}
const VoteIdea = ({idea}: props) => {
    function clickedLike(){
        if(idea.likes == 0){
            idea.likes = 1
        } else{
            idea.likes = 0
        }
    }

    function clickedDislike(){
        if(idea.dislikes == 0){
            idea.dislikes = 1
        } else{
            idea.dislikes = 0
        }
    }
  return (
    <div>
        <div>${idea.thought}</div>
        <div>
            <button onClick={clickedLike}>Like</button>
            <button onClick={clickedDislike}>Disike</button>
        </div>
    </div>
  )
}

export default VoteIdea