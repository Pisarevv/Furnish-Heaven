import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getUserProducts } from '../../services/storeProductsService';
import './Recycle.css'
import ProductCard from './ProductCard';
import { AuthContext } from '../../contexts/AuthContext';

const Recycle = () => {

    const {user} = useContext(AuthContext);
    const [userProducts,setTrendingProducts] = useState([]);

    useEffect(() => {
      (async () => {
        const result = await getUserProducts();
        setTrendingProducts(userProducts => result);
        console.table(result)
      })()
    },[])
    
    console.log(userProducts);


    return (
        <section className="catalog">
            <div className="container"> 
            {user._id && <NavLink className="sell-btn" to="/create">Create listing</NavLink>}
 
            <div className="trending-container">
                <h3>Latest users listings:</h3>
                <div className='trendingProducts-container'>
                    {userProducts.map(x => <ProductCard key={x._id} productInfo = {x}/>)}
                 
                </div>
            </div>
             
            </div>
        </section>
    )
}


export default Recycle;

