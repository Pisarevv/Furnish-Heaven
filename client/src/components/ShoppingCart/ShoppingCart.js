/**
 * Shopping Component
 * ---------------------
 * This component displays the shopping cart information of the user
 * with the product that he has added.
 * The products can be from the store products and user listing products.
 * The user has thet abillity to modify the quantity or remove products
 * from the cart and see the final cost of the shopping cart.
 * Button to continue shopping which navigates to "Products" page is provided
 * and a "Check out" button which currently is unavaliable.
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - cartProducts (array): The collection holding all the products (user listing products and store products)
 *   that the user has added to the cart.
 * - totalPrice (string): The final sum of all of the product prices. Every time anything in the cart changes
 *   triggers a useEffect which updates the total price.
 * ---------------------
 * 
 * Contexts:
 * ----------------   
 *  - useCartContext
 *  In this component this context provides the "cart" containing all the products added 
 *  via the context in the localStorage and  "removeProductFromCart" function
 *  which removes the product from the context if a user removes it from the cart.
 * -----------------
 * 
 * Variables: 
 * -----------------
 * userProductIds (array) : used to store the user listing products ids.
 * storeProductIds (array) : used to store the store product ids.
 * allProducts (array) : stores both user listing products and store products after them
 * being recieved from the server.
 * 
 * -----------------
 * Functions:
 * -----------------
 * - AssignCartRecordIdToProductId
 * A function recieving the records Ids of the products in the cart and 
 * adding in to the passed collection with products that the user has added
 * in their cart.
 * - removeProduct
 * Function that removes the product from the user cart. It recieves cart record Id as an input.
 * - modifyQuantity
 * Function that changes the quanitity of a product. It recieves cart record Id as an input.
 * -----------------
**/

import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCartContext } from '../../contexts/CartContext';
import { getAllStoreProductsForCart, getAllUserProductsForCart, removeProductFromCartById } from '../../services/cartService';
import { AssignCartRecordIdToProductId } from '../../utils/Common';
import CartProductCard from './CartProductCard';
import './ShoppingCart.css';
import IsLoadingHOC from '../Common/IsLoadingHoc';

const ShoppingCart = (props) => {

    const [cartProducts, setCartProducts] = useState([]);
    const { cart , removeProductFromCart} = useCartContext();
    
    const {setLoading} = props;
    
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
            let allProducts = [];
            const userProductIds = cart.filter(p => p.isStoreProduct === false).map(x => x._productId); 
            const storeProductIds = cart.filter(p => p.isStoreProduct === true).map(x => x._productId); 

            //Taking the record Ids based on the products in the cart
            let cardRecordIds = cart.map(x => { return { cartRecId :x._id , productId : x._productId}});

            if(userProductIds.length > 0)
            {
                let userProducts = await getAllUserProductsForCart(userProductIds);
                userProducts = AssignCartRecordIdToProductId(cardRecordIds,userProducts);
                userProducts = userProducts.map(product => ({ ...product, quantity: 1 }));

                allProducts = [...userProducts];
            }  
            if(storeProductIds.length > 0)
            {
                let storeProducts = await getAllStoreProductsForCart(storeProductIds);
                storeProducts = AssignCartRecordIdToProductId(cardRecordIds,storeProducts);
                storeProducts = storeProducts.map(product => ({ ...product, quantity: 1 }));

                allProducts = [...allProducts,...storeProducts];
            }
            setCartProducts(allProducts);
            setLoading(false);
        }
        )()
    }, []);

    useEffect(() => {
     let totalPriceOfAllProducts = cartProducts.map(x => x.price * x.quantity).reduce((acc,curr) => acc + curr ,0);
     setTotalPrice(totalPriceOfAllProducts);
  
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
                        {/* TODO: Add paragraph when there are no products  */}
                    {cartProducts.map(p => <CartProductCard key={p._id} productInfo={p} removeProduct = {removeProduct} modifyQuantity = {modifyQuantity} />)}
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

export default IsLoadingHOC(ShoppingCart);


