import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../contexts/CartContext';
import { getAllUserProductsForCart } from '../../services/cartService';
import './ShoppingCart.css';

const ShoppingCart = () => {

    const [productsId, setProductsIds] = useState();
    const {cart} = useContext(CartContext)

    useEffect(() => {
       (async () => 
       {
        // setProductsIds(cart.map(x => x._productId));
        const productIds = cart.map(x => x._productId);
        // let searchString = "";
        // productIds.forEach(x => searchString += `"${x}",`);
        // let slicedString = searchString.slice(0, searchString.length-1);
        // console.log(slicedString);
        const products = await getAllUserProductsForCart(productIds);
       }
       )()
    },[]);

    console.log(productsId);
    
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
                <ul className="cartWrap">
                    <li className="items odd">

                        
                    </li>


                </ul>
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