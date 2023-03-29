import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getUserProducts } from '../../services/userProductsService';
import './Recycle.css'
import ProductCard from './ProductCard';
import { AuthContext } from '../../contexts/AuthContext';
import Observe from '../../utils/Observer';

const Recycle = () => {

    const {user} = useContext(AuthContext);
    const [userProducts,setTrendingProducts] = useState([]);

    useEffect(() => {
      (async () => {
        Observe();
        const result = await getUserProducts();
        setTrendingProducts(userProducts => result);
        window.scrollTo(0, 0);
      })()
    },[])
    


    return (
        <section className="catalog">
            <div className="container"> 
            {user._id && <NavLink className="sell-btn" to="/create">Create listing</NavLink>}
 
            <div className="trending-container">
                <h3 className='hidden'>Latest users listings:</h3>
                <div className='trendingProducts-container hidden'>
                    {userProducts.map(x => <ProductCard key={x._id} productInfo = {x}/>)}
                 
                </div>
            </div>
             
            </div>
        </section>
    )
}


export default Recycle;

