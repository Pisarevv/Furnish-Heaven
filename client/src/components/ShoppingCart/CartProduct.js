import './CartProduct.css';

const CartProduct = ({ productInfo }) => {
    const { _id, imgUrl, quantity, model, price } = productInfo;
    console.log(productInfo)
    return (
         <div className="items even">
            <div className="infoWrap">
                <div className="cartSection">
                    <img src={imgUrl} alt="" className="itemImg" />
                    <p className="itemNumber">{model}</p>
                    <h3>{model}</h3>
                    <p> <input type="text" className="qty" placeholder={quantity} /> x ${price}</p>
                    <p className="stockStatus">In Stock</p>
                </div>
                <div className="prodTotal cartSection">
                    <p>{quantity * price}</p>
                </div>
                <div className="cartSection removeWrap">
                    <a href="#" className="remove">x</a>
                </div>
            </div>
        </div>

    )
}

export default CartProduct;


        // <li className="items even">
        //     <div className="infoWrap">
        //         <div className="cartSection">

        //             <img src={imgUrl} alt="" className="itemImg" />
        //             <p className="itemNumber">{model}</p>
        //             <h3>{model}</h3>
        //             <p> <input type="text" className="qty" placeholder={quantity} /> x ${price}</p>
        //             <p className="stockStatus">In Stock</p>
        //         </div>
        //         <div className="prodTotal cartSection">
        //             <p>{quantity * price}</p>
        //         </div>
        //         <div className="cartSection removeWrap">
        //             <a href="#" className="remove">x</a>
        //         </div>
        //     </div>
        // </li>
