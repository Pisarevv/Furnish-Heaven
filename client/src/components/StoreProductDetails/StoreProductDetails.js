import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { CartContext } from "../../contexts/CartContext";
import { addProductToCartById, removeProductFromCartById } from "../../services/cartService";
import { getStoreProductById } from "../../services/storeProductsService";
import { deleteUserProductById, getUserProductById } from "../../services/userProductsService";
import "./StoreProductDetails.css";

const StoreProductDetails = () => {

    const { user } = useContext(AuthContext);
    const { cart, addProductToCart, removeProductFromCart } = useContext(CartContext);
    const isStoreProduct = true;

    const [productInfo, setProductInfo] = useState("");
    const [isAddedToCart, setIsAddedToCart] = useState();

    const [productStatusInCart, setProductStatusInCart] = useState();

    const { id } = useParams();

    const navigate = useNavigate();


    useEffect(() => {
        (async () => {
            const result = await getStoreProductById(id)
            setProductInfo(result);
            setProductStatusInCart(cart.find(p => p._productId === id))
            setIsAddedToCart(cart.some(p => p._productId === id))
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
        let response = await addProductToCartById(id,isStoreProduct)
        addProductToCart(response);
        setIsAddedToCart(true)
    }

    const onRemoveProductFromCart = async (e) => {
        e.preventDefault()
        await removeProductFromCartById(productStatusInCart._id)
        removeProductFromCart(productStatusInCart._id);
        setIsAddedToCart(false)
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
        </section>

    )
}

export default StoreProductDetails;

