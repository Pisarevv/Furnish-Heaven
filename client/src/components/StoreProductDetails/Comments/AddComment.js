import "./AddComment.css"

const AddComment = () => {

    return (
        <>
            <h2>Add Comment</h2>
            <form id="add-comment-form">


                <label for="comment">Comment:</label>
                <textarea id="comment" name="comment" rows="4" required></textarea>

                <button type="submit">Submit</button>
            </form></>
    )
}

export default AddComment;