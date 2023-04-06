/**
 * UserListings  Component
 * ---------------------
 * This component displays the products that the user has created
 * listings for. He can edit or delete listing.
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - userListings (array): The collection holding the fetched user listings products products from the server.
 * ---------------
 * 
 *  * Contexts:
 * ----------------
 * - useAuthContext
 *  In this component this context provides the "user" object.
 *  The purpose of this object here is to identify if the user,
 *  his and his listings.
 *  ---------------
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


import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";

import { ErrorHandler } from "../../utils/ErrorHandler/ErrorHandler";

import { getAllUserListings } from "../../services/userProductsService";

import IsLoadingHOC from "../Common/IsLoadingHoc";
import Observe from "../../utils/Observer";

import UserProductCard from "../Recycle/UserProductCard";

import './UserListings.css'

const UserListings = (props) => {

    const { user } = useAuthContext();

    const [userListings, setUserListings] = useState([]);
   
    const { setLoading } = props;

  
    useEffect(() => {
        (async () => {
            try {
                window.scrollTo(0, 0);
                const fetchedUserListings = await getAllUserListings(user._id); 
                setUserListings(userListings => fetchedUserListings);
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
            <div className="recycle-container">
                <div className="userListing-container">
                    <div className='userListingsProducts-container hidden'>
                        {userListings.length > 0 ? 
                        userListings.map(x => <UserProductCard key={x._id} productInfo={x} />)
                        : <>
                          <h3>You haven't created any listings yet.</h3>
                        <NavLink className="sell-btn" to="/create">Create listing</NavLink>
                        </>}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default IsLoadingHOC(UserListings);