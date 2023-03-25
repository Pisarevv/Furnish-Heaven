import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCartContext } from '../../contexts/CartContext';
import { getAllUserProductsForCart, removeProductFromCartById } from '../../services/cartService';
import { AssignCartRecordIdToProductId } from '../../utils/Common';
import CartProduct from './CartProduct';
import './ShoppingCart.css';

const ShoppingCart = () => {

    const [cartProducts, setCartProducts] = useState([]);
    const { cart , removeProductFromCart} = useCartContext();
    
    const [totalPrice, setTotalPrice] = useState(0);

    const removeProduct = async (id) => {
       await removeProductFromCartById(id);
       removeProductFromCart(id);
       setCartProducts(cartProducts => cartProducts.filter(p => p.cartRecId !== id));
    }

    const modifyQuantity = (id,quantity) => {
        let product = cartProducts.find(x => x.cartRecId == id);
        product.quantity = quantity;
        setCartProducts(cartProducts.slice())
        console.log(cartProducts)
    }

    useEffect(() => {
        (async () => {
            const productIds = cart.map(x => x._productId); 
            if(productIds.length > 0){
                let cardRecordIds = cart.map(x => { return { cartRecId :x._id , productId : x._productId}});
                let products = await getAllUserProductsForCart(productIds);
                products = AssignCartRecordIdToProductId(cardRecordIds,products);
                products = products.map(product => ({ ...product, quantity: 1 }))
                console.log(products);
                setCartProducts(products);
            }  
        }
        )()
    }, []);

    useEffect(() => {
     let totalPriceOfAllProducts = cartProducts.map(x => x.price * x.quantity).reduce((acc,curr) => acc + curr ,0);
     setTotalPrice(totalPriceOfAllProducts);
     console.log(totalPriceOfAllProducts);
    },[cartProducts]);


    return (
        <div className="wrap cf">
            <div className="heading cf">
                <h1>My Cart</h1>
                <NavLink className="continue" to ="/">Continue Shopping</NavLink>
            </div>
            <div className="cart">
                <ul className="cartWrap">
                    <li className="items odd">
                    {cartProducts.map(p => <CartProduct key={p._id} productInfo={p} removeProduct = {removeProduct} modifyQuantity = {modifyQuantity} />)}
                    </li>

                </ul>
            </div>

            <div className="subtotal cf">
                <ul>
                    <li className="totalRow final"><span className="label">Total</span><span className="value">${totalPrice}</span></li>
                    <li className="totalRow"><a href="#" className="btn continue">Checkout</a></li>
                </ul>
            </div>
        </div>

    )
}

export default ShoppingCart;


