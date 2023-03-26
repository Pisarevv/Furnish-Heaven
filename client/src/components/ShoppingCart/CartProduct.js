import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
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

