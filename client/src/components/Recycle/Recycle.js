/**
 * Recycle Component
 * ---------------------
 * This component displays the store user products page with products listings.
 * The user can see a product card containing the model, price and image of the product.
 * A details button on every card is available witch on click redirects to the details 
 * component about the product.
 * If the user is authenticated a button "Create listing" above the listings is available.
 * The user can create his own listing of a product. 
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - searchCriteria (string) : A string that the products will be filtered based if they contain in
 *   in their "model"
 * - userProducts (array): The collection holding the fetched user products from the server.
 * - filteredProducts (array): The collection holding the filtered userProducts based on the input
 *   search criteria
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
import { NavLink, useParams } from 'react-router-dom';

import { useAuthContext } from '../../contexts/AuthContext';

import { getAllUserProducts, getUserProducts } from '../../services/userProductsService';

import Observe from '../../utils/Observer';
import IsLoadingHOC from '../Common/IsLoadingHoc';

import UserProductCard from './UserProductCard';

import './Recycle.css'
import { ErrorHandler } from '../../utils/ErrorHandler/ErrorHandler';
import Pagination from '../Pagination/Pagination';

const Recycle = (props) => {

    const { isAuthenticated } = useAuthContext();
    const [userProducts, setTrendingProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState();
    const { setLoading } = props;

    //Pagination
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [userProductsCount, setUserProductsCount] = useState(0);
    const { page: currentPage } = useParams();

    useEffect(() => {
        (async () => {
            try {
                window.scrollTo(0, 0);
                const fetchedUserProductsInformation = await getAllUserProducts(Number(currentPage), itemsPerPage);
                const fetchedUserProducts = fetchedUserProductsInformation.fetchedUserProducts;
                const fetchedUserProductsCount = fetchedUserProductsInformation.userProductsCount;

                setUserProductsCount(userProductsCount=> fetchedUserProductsCount);
                
                setTrendingProducts(userProducts => fetchedUserProducts);
                setFilteredProducts(filteredProducts => fetchedUserProducts);
                setLoading(false);
                Observe();
            }
            catch (error) {
                ErrorHandler(error);
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                window.scrollTo(0, 0);
                const fetchedUserProductsInformation = await getAllUserProducts(Number(currentPage), itemsPerPage);
                const fetchedUserProducts = fetchedUserProductsInformation.fetchedUserProducts;
                const fetchedUserProductsCount = fetchedUserProductsInformation.userProductsCount;

                setUserProductsCount(userProductsCount=> fetchedUserProductsCount);
                
                setTrendingProducts(userProducts => fetchedUserProducts);
                setFilteredProducts(filteredProducts => fetchedUserProducts);
                setLoading(false);
            }
            catch (error) {
                ErrorHandler(error);
            }
        })()
    }, [currentPage])

    useEffect(() => {
        if (searchCriteria === "") {
            setFilteredProducts(userProducts);
        }
        else {
            setFilteredProducts(userProducts.filter(p => (p.model).toLowerCase().includes(searchCriteria.toLowerCase())));
        }

    }, [searchCriteria]);

    const onSearchHandler = (e) => {
        e.preventDefault();
        setSearchCriteria(e.target.value);
    }




    return (
        <section className="catalog">

            <div className="searchBox">
                <input className="searchInput" type="text" name="" value={searchCriteria} onChange={onSearchHandler} placeholder="Search in this page"></input>
            </div>

            <div className="createListing">
                {isAuthenticated && <NavLink className="sell-btn" to="/create">Create listing</NavLink>}
            </div>


            <div className="recycle-container">


                <div className="trending-container">
                    <div className='trendingProducts-container hidden'>
                        {filteredProducts.map(x => <UserProductCard key={x._id} productInfo={x} />)}
                    </div>
                </div>

                {userProductsCount > 0  &&
                     <div>
                     <Pagination
                      pageInfo = {{ itemsCount : userProductsCount, itemsPerPage, currentPage}}
                      setLoadingStatus = {setLoading}
                      navigationPageName = {"recycle"}  />
                 </div>}
                   

            </div>
        </section>
    )
}


export default IsLoadingHOC(Recycle);

