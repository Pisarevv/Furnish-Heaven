/**
 * CommentCard Component
 * ---------------------
 * This component displays information about a comment - 
 * the user who has posted it, the date that it has been posted 
 * and the comment text.
 * If the user is the creator of the comment he can 
 * edit or delete it.
 * ---------------------- 
**/

import { useState } from "react";

import EdiText from 'react-editext';

import "./CommentCard.css"

const CommentCart = ({commentData, user, onCommentDelete,onCommentEdit}) => {

    const {author,text,_createdOn,_id} =  commentData;

    const [editing, setEditing] = useState(false);

    const createdOnDate = new Date(_createdOn).toLocaleString();
    
    const handleSave = (value) => {
      onCommentEdit(_id,value);
      setEditing(false);
    };

    const handleDelete = () => {
      onCommentDelete(_id);
    };

   
    return (
        <div className="comment-card">
        <div className="user-info">
          <div className="user-name-date">
            <h4 className="user-name">{author.email}</h4>
            {<p className="comment-date">{createdOnDate}</p>}
            
          </div>
          
        </div>
        {
        user._id == author._id ? 
           <EdiText className="edit-comment"
           value={text}
           type="text"
           onSave={handleSave}
           onCancel={handleDelete}
           editing={editing}  
         />  
         :     
        <p className="comment-text"> {text} </p> 
         }
            
      </div>
    )
}


export default CommentCart;