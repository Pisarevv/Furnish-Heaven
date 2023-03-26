import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './StoreProducts.css'
import StoreProductCard from './StoreProductCard';
import { AuthContext } from '../../contexts/AuthContext';
import Observer from '../../utils/Observer';
import { getAllStoreProducts } from '../../services/storeProductsService';

const StoreProducts = () => {

    const {user} = useContext(AuthContext);
    const [storeProducts,setStoreProducts] = useState([]);

    const observer = Observer;

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el)); 

    useEffect(() => {
      (async () => {
        const result = await getAllStoreProducts();
        setStoreProducts(storeProducts => result);
        window.scrollTo(0, 0);
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

