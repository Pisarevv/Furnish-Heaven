import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useCartContext } from '../../contexts/CartContext';
import './CartProduct.css';

const CartProduct = ({ productInfo , removeProduct, modifyQuantity}) => {
  
    const [productQuantity, setProductQuantity] = useState(0);
    const [totalProductPrice, setTotalProductPrice] = useState(0);
    const { _id, imgUrl, quantity, model, price, cartRecId } = productInfo;
    
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

export default CartProduct;


// <li classNameName="items even">
//     <div classNameName="infoWrap">
//         <div classNameName="cartSection">

//             <img src={imgUrl} alt="" classNameName="itemImg" />
//             <p classNameName="itemNumber">{model}</p>
//             <h3>{model}</h3>
//             <p> <input type="text" classNameName="qty" placeholder={quantity} /> x ${price}</p>
//             <p classNameName="stockStatus">In Stock</p>
//         </div>
//         <div classNameName="prodTotal cartSection">
//             <p>{quantity * price}</p>
//         </div>
//         <div classNameName="cartSection removeWrap">
//             <a href="#" classNameName="remove">x</a>
//         </div>
//     </div>
// </li>

<div className="infoWrap">
    <div className="cartSection">

        <img src="http://lorempixel.com/output/technics-q-c-300-300-4.jpg" alt="" className="itemImg" />
        <p className="itemNumber">#QUE-007544-002</p>
        <h3>Item Name 1</h3>

        <p> <input type="text" className="qty" placeholder="3" /> x $5.00</p>

        <p className="stockStatus"> In Stock</p>
    </div>


    <div className="prodTotal cartSection">
        <p>$15.00</p>
    </div>
    <div className="cartSection removeWrap">
        <a href="#" className="remove">x</a>
    </div>
</div>