/**
 * CartProductCard Component
 * ---------------------
 * This component displays the product info that a user has added to their shopping cart
 * with its price, model, quantity, image. There is a button to remove the product from the cart.
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - productQuantity (number): Holding the quanitity of the current product.
 * - totalProductPrice (numer): Holding the final price of the current product based on its price and quantity.
 * ---------------------
 * 
 * Props: 
 * -----------------
 * - imgUrl (string) - containing the URL link for the image
 * - quantity (number) - containing the quantity of the product
 * - model (string) - containing the model of the product
 * - price (number) - containing the price of the product
 * - cartRecId (string) - containing the cart record Id of the product in the cart
 * -----------------
 * 
 * Functions:
 * -----------------
 * - removeProduct
 * Function that removes the product from the user cart. It recieves cart record Id as an input.
 * - modifyQuantity
 * Function that changes the quanitity of a product. It recieves cart record Id as an input.
 * -----------------
**/
import { useEffect, useState } from 'react';

import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './CartProductCard.css';

const CartProductCard = ({ productInfo , removeProduct, modifyQuantity}) => {
  
    const [productQuantity, setProductQuantity] = useState(0);
    const [totalProductPrice, setTotalProductPrice] = useState(0);
    const { imgUrl, quantity, model, price, cartRecId } = productInfo;
    
    const onQuantityChange = (e) => {
        e.preventDefault();
        setProductQuantity(e.target.value);
        //TODO : add validation
        let currentPrice = e.target.value * price;
        setTotalProductPrice(currentPrice);
        modifyQuantity(cartRecId,e.target.value)
    }

    useEffect( () => {
        setProductQuantity(quantity);
        setTotalProductPrice(price);
    },[])

    return (
        <div className="infoWrap">
            <div className="cartSection product">
                <img src={imgUrl}  className="itemImg" />
                <h3>{model}</h3>
            </div>
            <div className="cartSection quantity">
                <p> <input type="text" className="qty" value={productQuantity} onChange = {onQuantityChange} /> x ${price}</p>
                <p className="stockStatus"> In Stock</p>
            </div>
            <div className="prodTotal cartSection">
                <p>${totalProductPrice}</p>
            </div>
            <div className="cartSection removeWrap">
              <FontAwesomeIcon className='remove' onClick={() => removeProduct(cartRecId)} icon={faRemove} />
            </div>
        </div>

    )
}

export default CartProductCard;

