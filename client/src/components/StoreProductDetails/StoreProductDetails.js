import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import { addProductToCartById, removeProductFromCartById } from "../../services/cartService";
import { createComment, deleteCommentById, editUserCommentById, getProductComments, updateUserCommentById } from "../../services/commentService";
import { getStoreProductById } from "../../services/storeProductsService";
import AddComment from "./Comments/AddComment";
import CommentCart from "./Comments/CommentCard";
import "./StoreProductDetails.css";
import IsLoadingHOC from "../Common/IsLoadingHoc";

const StoreProductDetails = (props) => {

    const { user } = useContext(AuthContext);
    const { cart, addProductToCart, removeProductFromCart } = useContext(CartContext);
    const IS_STORE_PRODUCT = true;

    const {setLoading} = props;

    const [productInfo, setProductInfo] = useState("");
    const [isAddedToCart, setIsAddedToCart] = useState();
    const [productComments, setProductComments] = useState([]);

    const [productStatusInCart, setProductStatusInCart] = useState();

    const { id } = useParams();

    useEffect(() => {
        (async () => {
            const product = await getStoreProductById(id);
            setProductInfo(product);
            const comments = await getProductComments(id);
            setProductComments(comments);
            setProductStatusInCart(cart.find(p => p._productId === id));
            setIsAddedToCart(cart.some(p => p._productId === id));
            setLoading(false);
        }
        )()
    }, [])

    useEffect(() => {
        (async () => {
            const result = await getStoreProductById(id)
            setProductInfo(result);
            setProductStatusInCart(cart.find(p => p._productId === id))
            console.table(cart);
            console.log("Has changed")
        }
        )()
    }, [isAddedToCart])

    const onProductAddToCart = async (e) => {
        e.preventDefault()
        let response = await addProductToCartById(id, IS_STORE_PRODUCT)
        addProductToCart(response);
        setIsAddedToCart(true)
    }

    const onRemoveProductFromCart = async (e) => {
        e.preventDefault()
        await removeProductFromCartById(productStatusInCart._id)
        removeProductFromCart(productStatusInCart._id);
        setIsAddedToCart(false)
    }

    const onCommentCreate = async (commentInput) => {
        await createComment(id, commentInput);
        const comments = await getProductComments(id);
        setProductComments(comments);
    }


    const onCommentDelete = async (commentId) => {
        await deleteCommentById(commentId);
        const comments = await getProductComments(id);
        setProductComments(comments);
    }

    const onCommentEdit = async (commentId, text) => {
        await editUserCommentById(commentId, text, id)
        const comments = await getProductComments(id);
        setProductComments(comments);
    }


    return (
        <section className="details-wrapper">
            <div className="details-container">
                <div className="details-product-wrapper">
                    <div className="details-product-container">
                        <div className="details-product-top">
                            <img src={productInfo.imgUrl}></img>
                        </div>

                        <div className="details-product-bottom">
                            <div className="details-product-left">
                                <div className="details-product-details">
                                    <p>Category :{productInfo.category}</p>
                                    <p>Model: {productInfo.model}</p>
                                    <p>Collection year: {productInfo.year}</p>
                                    <p>{productInfo.description}</p>
                                    <p>Material: {productInfo.material}</p>
                                    <p>Rating : {productInfo.rating}</p>

                                    {(user._id && user._id !== productInfo._ownerId && isAddedToCart) &&
                                        <NavLink className="sell-btn" onClick={onRemoveProductFromCart}>Remove from cart</NavLink>}

                                    {(user._id && user._id !== productInfo._ownerId && !isAddedToCart) &&
                                        <NavLink className="sell-btn" onClick={onProductAddToCart}>Add to cart</NavLink>}
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="comments-container"> COMMENTS :
                <div className="comments">
                    {productComments.length > 0 ?
                        productComments.map(pc => <CommentCart key={pc._id} commentData={pc} user={user} onCommentDelete={onCommentDelete} onCommentEdit={onCommentEdit} />)
                        : <p>There are no comments yet.</p>}
                </div>
                {user._id &&
                    <div className="add-comment-container">
                        <AddComment productId={id} onCommentCreate={onCommentCreate} />
                    </div>}

            </div>
        </section>

    )
}

export default IsLoadingHOC(StoreProductDetails);

