import "./CommentCard.css"
import EdiText from 'react-editext';
import { useState } from "react";

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