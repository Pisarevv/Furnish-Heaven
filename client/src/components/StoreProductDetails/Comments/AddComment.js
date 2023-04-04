import { useState } from "react";

import "./AddComment.css"

const AddComment = ({ onCommentCreate }) => {

    const [commentInput, setCommentInput] = useState("");

    const OnInputChange = (e) => {
        setCommentInput(e.target.value)
    }

    const onCreateHandler = (e) => {
        e.preventDefault();
        onCommentCreate(commentInput);
        setCommentInput(commentInput => "");  
    }

    return (
        <>
            <h2>Add Comment</h2>
            <label htmlFor="comment">Comment:</label>
            <textarea id="comment" name="comment" rows="4" onChange={OnInputChange} value = {commentInput}></textarea>
            <button type="submit" onClick={onCreateHandler}>Submit</button>
        </>
    )
}

export default AddComment;