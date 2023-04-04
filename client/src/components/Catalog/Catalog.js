/**
 * Catalog Component
 * ---------------------
 * This component displays the starting page of the website with 
 * the welcoming slogans and showing the top 4 most trending products.
 * Trending products are products that have more than 5 rating on them.
 * The catalog provides two buttons - a button to navigate to the store products page or 
 * user listing products
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - trendingProducts (array): The collection holding the fetched products from the server.
 *  Example 
 * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * [{…}, {…}, {…}, {…}]
 * 0: 
 * {_id: '53d4dbf5-7f41-47ba-b485-43eccb91cb95', model: 'Opulent Oaken Boardroom Table', price: 1235, imgUrl: 'https://www.bentleydesigns.com/images/products/large/3074_10186.jpg', rating: 9.5, description : ...}
 * 1: 
 * {_id: '22d4dbf5-7f41-47ba-b485-43eccb91cb95', model: 'Regal Slumber Haven', price: 2235, imgUrl: 'https://www.idfdesign.com/images/luxury-classic-bed-and-canopy-bed/r45-bed-carved-beds-3.jpg', rating: 8.8, description : ...}
 * -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * ---------------
 * 
 * Contexts:
 * ----------------
 * - useAuthContext
 *  In this component this context provides the "userLogout" function.
 *  The purpose of this function here is when the user has an expired 
 *  access token to be logged out on the first opening of the page
 *  and set localStorage key containing the user information to default.
 *  
 *  - useCartContext
 *  In this component this context provides the "emptyCart" function.
 *  The purpose of this function here is also when the user has an expired 
 *  access token have his cart in the localStorage set to the default value on the 
 *  first opening of the page.
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
 *  In the current case with a invalid access  token the user recieves a 
 *  notification containing :
 *  title : "Invalid access token"
 *  message : "Your session has expired. Please log in again."
 * -----------------
**/

import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useAuthContext } from '../../contexts/AuthContext';
import { useCartContext } from '../../contexts/CartContext';

import { ErrorHandler } from '../../utils/ErrorHandler/ErrorHandler';

import { getTrendingProducts } from '../../services/storeProductsService';

import TrendingProductCard from './TrendingProductCard';

import Observe from '../../utils/Observer';
import IsLoadingHOC from '../Common/IsLoadingHoc';

import './Catalog.css'


const Catalog = (props) => {

    const { userLogout } = useAuthContext();
    const { emptyCart } = useCartContext();

    const { setLoading } = props;

    const [trendingProducts, setTrendingProducts] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                window.scrollTo(0, 0);
                const result = await getTrendingProducts();
                setTrendingProducts(trendingProducts => result);
                setLoading(false);
                Observe();
            }
            catch (error) {
                if (error === "Invalid access token") {
                    ErrorHandler(error)
                    setLoading(false);
                    userLogout();
                    emptyCart();
                };
            }
        }
        )()
    }, [])


    return (
        <section className="catalog">
            
            <div className="container">
                <div className="welcome-container hidden">
                    <div className="catalog-text">
                        <h1 className="welcome-msg hidden"><span>Your</span> home should tell the story of who you are,
                            <br className='hidden'></br>and be a collection of what you love.</h1>
                    </div>
                </div>



                <div className="introduction-container hidden">
                    <p className='hidden'>Where we bring you the finest collection of furniture pieces that will transform your home into a sophisticated haven of style and comfort.</p>
                    <p className='hidden'>Our exclusive collection features the finest handcrafted furniture made from the highest quality materials and designed by world-renowned artisans.</p>
                    <p className='hidden'> Each piece is a masterpiece that exudes elegance, luxury, and sophistication.</p>
                    <p className='hidden'></p>
                    <NavLink className="explore-btn hidden" to="/products">Explore our collections</NavLink>
                </div>



                <div className="trending-container hidden">
                    <h3 className='hidden'>Trending products:</h3>
                    <div className='trendingProducts-container hidden'>
                        {trendingProducts.map(x => <TrendingProductCard key={x._id} productInfo={x} />)}
                    </div>
                </div>



                <div className="resell-container hidden">
                    <p className='hidden'>We fully support the idea of selling old furniture to help save the environment.</p>
                    <p className='hidden'>By selling your old furniture from our website we are donating 5% of the price of the product to organizations that are helping the enviroment.
                        We believe that every small step counts towards a better future, and by selling your old furniture, you're making a significant contribution to protecting the planet.
                        So, if you're looking for a sustainable and eco-friendly way to furnish your home, we're here to help.</p>
                    <p className='hidden'>Thank you for supporting our mission to create a greener and more sustainable future.</p>
                    <p className='hidden'></p>
                    <NavLink className="sell-btn hidden" to="/recycle">Retail your old furniture</NavLink>
                </div>

            </div>

        </section>

    )
}


export default IsLoadingHOC(Catalog);

