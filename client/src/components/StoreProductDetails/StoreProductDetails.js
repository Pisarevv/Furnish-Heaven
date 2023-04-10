/**
 * StoreProductDetails Component
 * ---------------------
 * This component displays the detailed product description 
 * containing its model, price, image, rating, year, price ,type and description.
 * If the user is logged in he can add or remove the product from the cart.
 * Authorized users can also add comments, edit or remove comments they have created.
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - productInfo (object): The object containing the product data fetched from the server.
 * - isAddedToCart (bool) : State of the product in the user cart - is it added or not
 * - productComments [array] : Array containing the comments related to the product
 * - id : String containing the current product Id.
 *  - IS_STATE_PRODUCT (bool) : Additional property stating that the product is not a 
 *    user listing product. This property is later used in the cart service for filtering.
 * ---------------------
 * 
 * Contexts:
 * ----------------
 * - useAuthContext
 *  In this component this context provides the "user" object.
 *  The purpose of this object here is to identify if the user,
 *  his cart, has and he previously commented.
 *  
 *  - useCartContext
 *  In this component this context provides one object "cart" and two functions "addProductToCart", "removeProductFromCart".
 *  The purpose of the cart object here is to identify if the current products is added to the user cart or not.
 * -----------------
 * 
 * Functions:
 * -----------------
 *   //Functions manipulating the cart
 * - addProductToCartById:
 *   This function adds the current product based on its id to the user shopping cart.
 * - removeProductFromCartById:
 *   This function removes the current product based on its id to the user shopping cart.
 *   //Function manipulating the product details
 * - getStoreProductById
 *   This function is fetches the details about the current product
 *   //Functions manipulating the product comments
 * - createComment, deleteCommentById, editUserCommentById, getProductComments functions are 
 *   responsible for the CRUD operations for the comments on the product
 * -----------------
 * - ErrorHandler
 *  This is a custom function that handles errors thrown by the REST api  
 *  and based on the error shows the user notifications.
 * - setLoading 
 *  This function removes the loading animation.
 * -----------------
**/

import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import {  useAuthContext } from "../../contexts/AuthContext";
import {  useCartContext } from "../../contexts/CartContext";

import { ErrorHandler } from "../../utils/ErrorHandler/ErrorHandler";

import { addProductToCartById, removeProductFromCartById } from "../../services/cartService";
import { createComment, deleteCommentById, editUserCommentById, getProductComments } from "../../services/commentService";
import { getStoreProductById } from "../../services/storeProductsService";

import AddComment from "./Comments/AddComment";
import CommentCart from "./Comments/CommentCard";
import IsLoadingHOC from "../Common/IsLoadingHoc";

import "./StoreProductDetails.css";


const StoreProductDetails = (props) => {

    const { user } = useAuthContext();
    const { cart, addProductToCart, removeProductFromCart } = useCartContext();

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
                                    <p>Category: {productInfo.category}</p>
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

