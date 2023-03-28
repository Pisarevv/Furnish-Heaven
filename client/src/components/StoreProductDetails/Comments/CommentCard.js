import "./CommentCard.css"

const CommentCart = (commentData) => {
    const {userEmail,commentText,commentDate} =  commentData;

    return (
        <div class="comment-card">
        <div class="user-info">
          <div class="user-name-date">
            <h4 class="user-name">{userEmail}</h4>
            {/* <p class="comment-date">{new Date(commentDate)}</p> */}
          </div>
        </div>
        <p class="comment-text">
          {commentText}
        </p>
      </div>
    )
}


export default CommentCart;