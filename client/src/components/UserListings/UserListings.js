import { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import IsLoadingHOC from "../Common/IsLoadingHoc";
import { getAllUserListings } from "../../services/userProductsService";
import Observe from "../../utils/Observer";
import { ErrorHandler } from "../../utils/ErrorHandler/ErrorHandler";
import UserProductCard from "../Recycle/UserProductCard";
import { NavLink } from "react-router-dom";

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