/**
 * Recycle Component
 * ---------------------
 * This component displays the store user products page with products listings.
 * The user can see a product card containing the model, price and image of the product.
 * A detail button on every card is available witch on click shows details about the product.
 * If the user is authenticated a button "Create listing" above the listings is available.
 * The user can create his own listing of a product. 
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - userProducts (array): The collection holding the fetched user products from the server.
 * ---------------
 * 
 * Contexts:
 * ----------------
 * - useAuthContext
 *  In this component this context provides the "isAuthenticated" variable.
 *  The purpose of this variable is to determine if the user is authorized or not 
 *  and based on that to render different navigation links.
 * -----------------
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
import { NavLink } from 'react-router-dom';

import { useAuthContext } from '../../contexts/AuthContext';

import { getUserProducts } from '../../services/userProductsService';

import Observe from '../../utils/Observer';
import IsLoadingHOC from '../Common/IsLoadingHoc';

import ProductCard from './ProductCard';

import './Recycle.css'
import { ErrorHandler } from '../../utils/ErrorHandler/ErrorHandler';

const Recycle = (props) => {

    const { isAuthenticated } = useAuthContext();
    const [userProducts, setTrendingProducts] = useState([]);
    const { setLoading } = props;

    useEffect(() => {
        (async () => {
            try {
                window.scrollTo(0, 0);
                const fetchedUserProducts = await getUserProducts();
                setTrendingProducts(userProducts => fetchedUserProducts);
                setLoading(false);
                Observe();
            }
            catch (error) {
                ErrorHandler(error);
            }
        })()
    }, [])



    return (
        <section className="catalog">
            <div className="container">
                {isAuthenticated && <NavLink className="sell-btn" to="/create">Create listing</NavLink>}

                <div className="trending-container">
                    <h3 className='hidden'>Latest users listings:</h3>
                    <div className='trendingProducts-container hidden'>
                        {userProducts.map(x => <ProductCard key={x._id} productInfo={x} />)}
                    </div>
                </div>

            </div>
        </section>
    )
}


export default IsLoadingHOC(Recycle);

