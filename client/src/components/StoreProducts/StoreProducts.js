/**
 * StoreProducts  Component
 * ---------------------
 * This component displays the store products page with products listings.
 * The user can see a product card containing the model, price and image of the product.
 * A details button on every card is available witch on click redirects to the details 
 * component about the product.
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - searchCriteria (string) : A string that the products will be filtered based if they contain in
 *   in their "model"
 * - storeProducts (array): The collection holding the fetched store products from the server.
 * - filteredProducts (array): The collection holding the filtered userProducts based on the input
 *   search criteria
 * ---------------
 * 
 * Functions:
 * -----------------
 * - Observe 
 *  This function is used for the animation of fading in in the page.
 * 
 * - ErrorHandler
 *  This is a custom function that handles errors thrown by the REST api  
 *  and based on the error shows the user notifications.
 *  
 *  - setLoading 
 *  This function removes the loading animation.
 * -----------------
**/

import { useEffect, useState } from 'react';

import { ErrorHandler } from '../../utils/ErrorHandler/ErrorHandler';

import { getAllStoreProducts } from '../../services/storeProductsService';

import Observe from '../../utils/Observer';

import StoreProductCard from './StoreProductCard';
import IsLoadingHOC from '../Common/IsLoadingHoc';

import './StoreProducts.css'

const StoreProducts = (props) => {

    const [storeProducts, setStoreProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState();
    const { setLoading } = props;

    useEffect(() => {
        (async () => {
            try {
                const fetchedStoreProducts = await getAllStoreProducts();
                setStoreProducts(storeProducts => fetchedStoreProducts);
                setFilteredProducts(filteredProducts => fetchedStoreProducts);
                setLoading(false);
                Observe();
                window.scrollTo(0, 0);
            }
            catch (error) {
                ErrorHandler(error);
            }
        })()
    }, [])

    useEffect(() => {
        if (searchCriteria === "") {
            setFilteredProducts(storeProducts);
        }
        else {
            setFilteredProducts(storeProducts.filter(p => (p.model).toLowerCase().includes(searchCriteria.toLowerCase())));
            console.log(searchCriteria);
        }

    }, [searchCriteria]);

    const onSearchHandler = (e) => {
        e.preventDefault();
        setSearchCriteria(e.target.value);
    }



    return (
        <section className="catalog">

            <div className="searchBox">
                <input className="searchInput" type="text" name="" value={searchCriteria} onChange={onSearchHandler} placeholder="Search"></input>
            </div>

            <div className="container">

                <div className="trending-container">

                    <div className='trendingProducts-container hidden'>
                        {filteredProducts.map(x => <StoreProductCard key={x._id} productInfo={x} />)}
                    </div>
                </div>

            </div>
        </section>
    )
}


export default IsLoadingHOC(StoreProducts);

