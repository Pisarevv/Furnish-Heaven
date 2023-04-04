import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons'

import './StoreProductCard.css'

const StoreProductCard = ({productInfo}) => { 
  const {imgUrl,model,price,description, _id} = productInfo;
    return (
        <div className="wrapper">
  <div className="container">
    <div className="top">
      <img src = {imgUrl}></img>
    </div>
    <div className="bottom">
      <div className="left">
        <div className="details">
          <p>{model}</p>
          <p>{price}$</p>
        </div>
        <NavLink className="sell-btn" to={`/products/${_id}`}>Details</NavLink>
      </div>
    </div>
    
  </div>
  <div className="inside">
    <div className="icon"><i className="material-icons"><FontAwesomeIcon icon={faArrowTrendUp}/></i></div>
    <div className="contents">
    </div>
    {description}
  </div>
</div>
    )
}


export default StoreProductCard;