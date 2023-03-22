import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import { addProductToCartById, removeProductFromCartById } from "../../services/cartService";
import { deleteUserProductById, getUserProductById } from "../../services/storeProductsService";
import "./UserProductDetails.css";

const UserProductDetails = () => {

    const [productInfo, setProductInfo] = useState("");
    const [isAddedToCart, setIsAddedToCart] = useState();
    const { id } = useParams();

    const navigate = useNavigate();

    const {user} = useContext(AuthContext);
    const {cart, addProductToCart, removeProductFromCart} = useContext(CartContext);

    

    useEffect(() => {
        (async () => {
            const result = await getUserProductById(id)
            setProductInfo(result);
            setIsAddedToCart(cart.some(p => p._productId === id))          
            console.log(id);
            console.log(cart);
        }
        )()
    }, [])

    console.log(isAddedToCart);

    const onProductDelete = async(e) => {
        e.preventDefault();
        await deleteUserProductById(id);
        navigate('/recycle');
    }

    const onProductAddToCart = async(e) => {
        e.preventDefault()
        let response = await addProductToCartById(user._id,id)
        addProductToCart(response);
        navigate('/recycle');
    }

    const onRemoveProductFromCart = async(e) => {
        e.preventDefault()
        let response = await removeProductFromCartById(user._id,id)
        removeProductFromCart(id);
        navigate('/recycle');
    }
    

    return (
        <section className="details-wrapper">
            <div className="details-container">
                <div className="details-product-wrapper">
                    <div className="details-product-container">
                        <div className="details-product-top">
                            <img src = {productInfo.imgUrl}></img>
                        </div>

                        <div className="details-product-bottom">
                            <div className="details-product-left">
                                <div className="details-product-details">
                                    <p>Category :{productInfo.category}</p>
                                    <p>Model: {productInfo.model}</p>
                                    <p>Collection year : {productInfo.year}</p>
                                    <p>{productInfo.description}</p>
                                    <p>Material: {productInfo.material}</p>

                                    {(user._id && user._id !==productInfo._ownerId &&  isAddedToCart)  &&
                                    <NavLink className="sell-btn" onClick={onProductAddToCart}>Remove from cart</NavLink> }
                                     
                                    {(user._id && user._id !==productInfo._ownerId &&  !isAddedToCart)  &&
                                    <NavLink className="sell-btn" onClick={onProductAddToCart}>Add to cart</NavLink> }
                                    
                                    {user._id === productInfo._ownerId && <>
                                        <NavLink className="sell-btn" to={`/recycle/${id}/edit`}>Edit</NavLink>
                                        <NavLink className="sell-btn" onClick= {onProductDelete}>Delete</NavLink>
                                        </>}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default UserProductDetails;

