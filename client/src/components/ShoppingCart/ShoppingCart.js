import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { getAllUserProductsForCart } from '../../services/cartService';
import CartProduct from './CartProduct';
import './ShoppingCart.css';

const ShoppingCart = () => {

    const [cartProducts, setCartProducts] = useState([]);
    const { cart } = useContext(CartContext)

    useEffect(() => {
        (async () => {
            // setProductsIds(cart.map(x => x._productId));
            const productIds = cart.map(x => x._productId);
            let products = await getAllUserProductsForCart(productIds);
            products = products.map(product => ({ ...product, quantity: 1 }))
            console.log(products);
            setCartProducts(products)
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
                <ul className="tableHead">
                    <li className="prodHeader">Product</li>
                    <li>Quantity</li>
                    <li>Total</li>
                    <li>Remove</li>
                </ul>
                {/* <ul className="cartWrap">
                    {cartProducts.map(p => <CartProduct key={p._id} productInfo={p} />)}
                </ul> */}
                <div className='cartProductsContainer'>
                    {cartProducts.map(p => <CartProduct key={p._id} productInfo={p} />)}
                </div>
            </div>

            <div className="subtotal cf">
                <ul className='total'>
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