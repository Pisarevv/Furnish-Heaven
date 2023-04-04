import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../../contexts/AuthContext';

import { ErrorHandler } from '../../utils/ErrorHandler/ErrorHandler';

import { getAllStoreProducts } from '../../services/storeProductsService';

import Observe from '../../utils/Observer';

import StoreProductCard from './StoreProductCard';
import IsLoadingHOC from '../Common/IsLoadingHoc';

import './StoreProducts.css'

const StoreProducts = (props) => {

    const {user} = useContext(AuthContext);
    const [storeProducts,setStoreProducts] = useState([]);
    const {setLoading} = props;

    useEffect(() => {
      (async () => {
        try {
        const result = await getAllStoreProducts();
        setStoreProducts(storeProducts => result);
        setLoading(false);
        Observe();
        window.scrollTo(0, 0);
        } 
        catch (error) {
            ErrorHandler(error);
        }
      })()
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


export default IsLoadingHOC(StoreProducts);

