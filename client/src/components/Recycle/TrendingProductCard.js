import './TrendingProductCard.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowTrendUp, faHeart } from '@fortawesome/free-solid-svg-icons'


const ProductTrending = ({productInfo}) => { 
    return (
        <div className="wrapper">
  <div className="container">
    <div className="top">
      <img src = {productInfo.imgUrl}></img>
    </div>
    <div className="bottom">
      <div className="left">
        <div className="details">
          <p>{productInfo.model}</p>
          <p>{productInfo.price}$</p>
        </div>
        <div className="buy"><i className="material-icons"><FontAwesomeIcon icon={faHeart} /></i></div>
      </div>
      <div className="right">
        <div className="done"><i className="material-icons">done</i></div>
        <div className="details">
          <h1>Chair</h1>
          <p>Added to your cart</p>
        </div>
        <div className="remove"><i className="material-icons">clear</i></div>
      </div>
    </div>
  </div>
  <div className="inside">
    <div className="icon"><i className="material-icons"><FontAwesomeIcon icon={faArrowTrendUp}/></i></div>
    <div className="contents">
      <table>
        <tbody>
        <tr>
          <th>Width</th>
          <th>Height</th>
        </tr>
        <tr>
          <td>3000mm</td>
          <td>4000mm</td>
        </tr>
        <tr>
          <th>Something</th>
          <th>Something</th>
        </tr>
        <tr>
          <td>200mm</td>
          <td>200mm</td>
        </tr>
        <tr>
          <th>Something</th>
          <th>Something</th>
        </tr>
        <tr>
          <td>200mm</td>
          <td>200mm</td>
        </tr>
        <tr>
          <th>Something</th>
          <th>Something</th>
        </tr>
        <tr>
          <td>200mm</td>
          <td>200mm</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
    )
}


export default ProductTrending;