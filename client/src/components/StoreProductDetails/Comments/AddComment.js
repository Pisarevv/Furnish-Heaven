import { useRef } from "react";
import { createComment } from "../../../services/commentService";
import "./AddComment.css"

const AddComment = ({productId}) => {

    const commentInput = useRef("");

    const createCommentHandler = async (e) => {
        e.preventDefault();
        // let result = await createComment(productId,commentInput.current.value);
        console.log(commentInput.current.value);


    }

    return (
        <>
            <h2>Add Comment</h2>
            <form id="add-comment-form">
                <label for="comment">Comment:</label>
                <textarea id="comment" name="comment" rows="4" required ref = {commentInput}></textarea>
                <button type="submit" onClick={createCommentHandler}>Submit</button>
            </form></>
    )
}

export default AddComment;