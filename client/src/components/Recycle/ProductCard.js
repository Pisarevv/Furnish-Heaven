import './ProductCard.css'
import { NavLink } from 'react-router-dom'

const ProductCard = ({ productInfo }) => {

  return (
    <div className="product-wrapper">
      <div className="product-container">
        <div className="product-top">
          <img src={productInfo.imgUrl}></img>
        </div>
        <div className="product-bottom">
          <div className="product-left">
            <div className="product-details">
              <p>{productInfo.model}</p>
              <p>{productInfo.price}$</p>
              <NavLink className="sell-btn" to={`/recycle/${productInfo._id}`}>Details</NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default ProductCard;