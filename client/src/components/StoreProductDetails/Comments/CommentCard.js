import "./CommentCard.css"

const CommentCart = (commentData) => {
    const {userEmail,commentText,commentDate} =  commentData;

    return (
        <div className="comment-card">
        <div className="user-info">
          <div className="user-name-date">
            <h4 className="user-name">{userEmail}</h4>
            {/* <p className="comment-date">{new Date(commentDate)}</p> */}
          </div>
        </div>
        <p className="comment-text">
          {commentText}
        </p>
      </div>
    )
}


export default CommentCart;