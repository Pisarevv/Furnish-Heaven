import { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";

import { ErrorHandler } from "../../utils/ErrorHandler/ErrorHandler";

import { addProductToCartById, removeProductFromCartById } from "../../services/cartService";
import { createComment, deleteCommentById, editUserCommentById, getProductComments } from "../../services/commentService";
import { getStoreProductById } from "../../services/storeProductsService";

import AddComment from "./Comments/AddComment";
import CommentCart from "./Comments/CommentCard";
import IsLoadingHOC from "../Common/IsLoadingHoc";

import "./StoreProductDetails.css";


const StoreProductDetails = (props) => {

    const { user } = useContext(AuthContext);
    const { cart, addProductToCart, removeProductFromCart } = useContext(CartContext);

    const IS_STORE_PRODUCT = true;

    const { setLoading } = props;

    const [productInfo, setProductInfo] = useState("");
    const [isAddedToCart, setIsAddedToCart] = useState();
    const [productComments, setProductComments] = useState([]);

    const [productStatusInCart, setProductStatusInCart] = useState();

    const { id } = useParams();

    useEffect(() => {
        (async () => {
            try {
                const product = await getStoreProductById(id);
                setProductInfo(product);
                const comments = await getProductComments(id);
                setProductComments(comments);
                setProductStatusInCart(cart.find(p => p._productId === id));
                setIsAddedToCart(cart.some(p => p._productId === id));
                setLoading(false);
            }
            catch (error) {
                ErrorHandler(error);
            }
        }
        )()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                const fetchedProduct = await getStoreProductById(id)
                setProductInfo(fetchedProduct);
                setProductStatusInCart(cart.find(p => p._productId === id))
                console.table(cart);
            }
            catch (error) {
                ErrorHandler(error);
            }
        }
        )()
    }, [isAddedToCart])

    const onProductAddToCart = async (e) => {
        e.preventDefault()
        try {
            let returnedProduct = await addProductToCartById(id, IS_STORE_PRODUCT)
            addProductToCart(returnedProduct);
            setIsAddedToCart(true)
        }
        catch (error) {
            ErrorHandler(error);
        }
    }

    const onRemoveProductFromCart = async (e) => {
        e.preventDefault()
        try {
            await removeProductFromCartById(productStatusInCart._id)
            removeProductFromCart(productStatusInCart._id);
            setIsAddedToCart(false);
        }
        catch (error) {
            ErrorHandler(error);
        }
    }

    const onCommentCreate = async (commentInput) => {
        try {
            await createComment(id, commentInput);
            const comments = await getProductComments(id);
            setProductComments(comments);
        }
        catch (error) {
            ErrorHandler(error);
        }
    }


    const onCommentDelete = async (commentId) => {
        try {
            await deleteCommentById(commentId);
            const comments = await getProductComments(id);
            setProductComments(comments);
        }
        catch (error) {
            ErrorHandler(error);
        }
    }

    const onCommentEdit = async (commentId, text) => {
        try {
            await editUserCommentById(commentId, text, id)
            const comments = await getProductComments(id);
            setProductComments(comments);
        }
        catch (error) {
            ErrorHandler(error);
        }
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

