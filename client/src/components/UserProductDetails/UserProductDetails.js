import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import { addProductToCartById, removeProductFromCartById } from "../../services/cartService";
import { deleteUserProductById, getUserProductById } from "../../services/storeProductsService";
import "./UserProductDetails.css";

const UserProductDetails = () => {

    const {user} = useContext(AuthContext);
    const {cart, addProductToCart, removeProductFromCart} = useContext(CartContext);

    const [productInfo, setProductInfo] = useState("");
    const [isAddedToCart, setIsAddedToCart] = useState();

    const [productStatusInCart,setProductStatusInCart] = useState();

    const { id } = useParams();
 
    const navigate = useNavigate();

    
    useEffect(() => {
        (async () => {
            const result = await getUserProductById(id)
            setProductInfo(result);
            setProductStatusInCart(cart.find(p => p._productId === id))          
            console.log(id);
            console.log(cart);
        }
        )()
    }, [])

    useEffect(() => {
        (async () => {
            setProductStatusInCart(cart.find(p => p._productId === id))        
        }
        )()
    }, [isAddedToCart])


    const onProductDelete = async(e) => {
        e.preventDefault();
        await deleteUserProductById(id);
        navigate('/recycle');
    }

    const onProductAddToCart = async(e) => {
        e.preventDefault()
        let response = await addProductToCartById(user._id,id)
        addProductToCart(response);
        setIsAddedToCart(true)
    }

    const onRemoveProductFromCart = async(e) => {
        e.preventDefault()
        await removeProductFromCartById(productStatusInCart._id)
        removeProductFromCart(id);     
        setIsAddedToCart(false)
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
                                    <p>Collection year: {productInfo.year}</p>
                                    <p>{productInfo.description}</p>
                                    <p>Material: {productInfo.material}</p>

                                    {(user._id && user._id !==productInfo._ownerId &&  isAddedToCart)  &&
                                    <NavLink className="sell-btn" onClick={onRemoveProductFromCart}>Remove from cart</NavLink> }
                                     
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

