/**
 * StoreUserProductCard Component
 * ---------------------
 * This component displays basic information - Image,model and price
 * about a store product as a card.
 * A button that redirects to the product datails is 
 * placed on the bottom of the card.
 * ---------------------- 
**/

import './UserProductCard.css'
import { NavLink } from 'react-router-dom'

const UserProductCard = ({ productInfo }) => {

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


export default UserProductCard;