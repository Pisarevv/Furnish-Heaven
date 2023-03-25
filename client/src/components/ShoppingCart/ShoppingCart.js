import { useContext, useEffect, useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { CartContext, useCartContext } from '../../contexts/CartContext';
import { getAllUserProductsForCart, getUserCartItems, removeProductFromCartById } from '../../services/cartService';
import { AssignCartRecordIdToProductId } from '../../utils/Common';
import CartProduct from './CartProduct';
import './ShoppingCart.css';

const ShoppingCart = () => {

    const [cartProducts, setCartProducts] = useState([]);
    const { cart , removeProductFromCart} = useCartContext();
    const { user} = useAuthContext();
    

    const removeProduct = async (id) => {
       await removeProductFromCartById(id);
       removeProductFromCart(id);
       setCartProducts(cartProducts => cartProducts.filter(p => p.cartRecId !== id));
    }

    useEffect(() => {
        (async () => {
            // setProductsIds(cart.map(x => x._productId));
            const productIds = cart.map(x => x._productId); 
            if(productIds.length > 0){
                let cardRecordIds = cart.map(x => { return { cartRecId :x._id , productId : x._productId}});
                let products = await getAllUserProductsForCart(productIds);
                products = AssignCartRecordIdToProductId(cardRecordIds,products);
                products = products.map(product => ({ ...product, quantity: 1 }))
                console.log(products);
                setCartProducts(products)
            }
            
        }
        )()
    }, []);


    return (
        <div className="wrap cf">
            <div className="heading cf">
                <h1>My Cart</h1>
                <a href="#" className="continue">Continue Shopping</a>
            </div>
            <div className="cart">
                <ul className="cartWrap">
                    <li className="items odd">
                    {cartProducts.map(p => <CartProduct key={p._id} productInfo={p} removeProduct = {removeProduct} />)}
                    </li>

                </ul>
            </div>

            <div className="subtotal cf">
                <ul>
                    <li className="totalRow"><span className="label">Subtotal</span><span className="value">$35.00</span></li>

                    <li className="totalRow"><span className="label">Shipping</span><span className="value">$5.00</span></li>

                    <li className="totalRow"><span className="label">Tax</span><span className="value">$4.00</span></li>
                    <li className="totalRow final"><span className="label">Total</span><span className="value">$44.00</span></li>
                    <li className="totalRow"><a href="#" className="btn continue">Checkout</a></li>
                </ul>
            </div>
        </div>

    )
}

export default ShoppingCart;


