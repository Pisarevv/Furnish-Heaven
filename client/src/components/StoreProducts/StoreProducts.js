import { useContext, useEffect, useState } from 'react';
import './StoreProducts.css'
import StoreProductCard from './StoreProductCard';
import { AuthContext } from '../../contexts/AuthContext';
import { getAllStoreProducts } from '../../services/storeProductsService';
import Observe from '../../utils/Observer';
import { ErrorHandler } from '../../utils/ErrorHandler/ErrorHandler';

const StoreProducts = () => {

    const {user} = useContext(AuthContext);
    const [storeProducts,setStoreProducts] = useState([]);

    useEffect(() => {
      (async () => {
        try {
        Observe();
        const result = await getAllStoreProducts();
        setStoreProducts(storeProducts => result);
        window.scrollTo(0, 0);
        } catch (error) {
            ErrorHandler(error);
        }
      })()
      //TODO: Add try catch
    },[])
    


    return (
        <section className="catalog">
            <div className="container">  
            <div className="trending-container">
                <h3 className='hidden'>Popular products:</h3>
                <div className='trendingProducts-container hidden'>
                    {storeProducts.map(x => <StoreProductCard key={x._id} productInfo = {x}/>)}             
                </div>
            </div>
             
            </div>
        </section>
    )
}


export default StoreProducts;

