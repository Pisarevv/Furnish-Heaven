/**
 * AddComment Component
 * ---------------------
 * This component gives the user the opportunity 
 * to add a comment to the product.
 * ---------------------- 
**/


import { useState } from "react";

import "./AddComment.css"
import { ErrorHandler } from "../../../utils/ErrorHandler/ErrorHandler";

const AddComment = ({ onCommentCreate }) => {

    const [commentInput, setCommentInput] = useState("");
    const [commentError, setCommentError] = useState("");

    const OnInputChange = (e) => {
        setCommentInput(e.target.value)
    }

    const validateComment = () => {
        if(commentInput === ""){
           setCommentError(commentError => "Comment cannot be empty.");
           return false;
        }
        setCommentError(commentError => "");
        return true;
    }

    const onCreateHandler = (e) => {
        e.preventDefault();
        try {
            let isCommentValid = validateComment();
            if(isCommentValid){
                onCommentCreate(commentInput);
                setCommentInput(commentInput => "");  
            }
            else{
                throw "Comment cannot be empty";
            }
            
        }
         catch (error) {
            ErrorHandler(error);
        }
       
    }

    return (
        <>
            <h2>Add Comment</h2>
            <label htmlFor="comment">Comment:</label>
            <textarea id="comment" name="comment" rows="4" onChange={OnInputChange} value = {commentInput}></textarea>
            {commentError && <p>{commentError}</p>}
            <button type="submit" onClick={onCreateHandler}>Submit</button>
        </>
    )
}

export default AddComment;