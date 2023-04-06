/**
 * Pagination Component
 * ---------------------
 * This component creates the pagination element with 
 * the functionallity to go trought different pages 
 * and display all the available page numbers.
 * The user can always see the first and last page number.
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - pageNumbersToDisplay (array): Collection of numbers that shows available pages and witch
 *  page the user is currently on and dynamically changes.
 * - totalPages (int) : Number holding the total pages that can be created
 *  based on the desired products per page and available products
 * ----------------------
 * 
 * Functions:
 * -----------------
 * - calculatePagesDisplayNumber 
 *  This function is calculates how to display the available 
 *  pages on the page navigation numbers.
 *  Example: (With 3 pages to show in navigation)
 *  If user is on page 5 of total 10 : [1.. 5 6 7 ...10]
 *  If user is on page 1 of total 4 : [1 2 3 4]
 *  If user is on page 5 of 6 [1.. 4 5 6]
 * 
 * - goToNextPage
 *  Function to navigating to next page
 * - goToPreviousPage
 *  Function to navigate to previous page
 * - gotoPage 
 *  Function to navigate to the page with the selected number
 * -----------------
**/

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftLong, faRightLong, } from '@fortawesome/free-solid-svg-icons'


const NUMER_OF_PAGES_TO_SHOW_IN_NAVIGATION = 4;

function calculatePagesDisplayNumber(totalPages, currentPage) {
    let numbersArray = [];
    if (totalPages <= NUMER_OF_PAGES_TO_SHOW_IN_NAVIGATION) {

        for (let i = 1; i <= totalPages; i++) {
            numbersArray.push(i);
        }
        return numbersArray;
    }
    else {
        if (currentPage == 1) {

            for (let i = currentPage + 1; i < currentPage + NUMER_OF_PAGES_TO_SHOW_IN_NAVIGATION ; i++) {
                numbersArray.push(i);
            }
            numbersArray.push(`..${totalPages}`);
            numbersArray.unshift(1);
            return numbersArray;

        }

        if(currentPage + NUMER_OF_PAGES_TO_SHOW_IN_NAVIGATION > totalPages){
            for (let i = totalPages; i > totalPages - NUMER_OF_PAGES_TO_SHOW_IN_NAVIGATION; i--) {
                numbersArray.push(i);
            }
            numbersArray.reverse();
            numbersArray.unshift("1..");

            return numbersArray;
        }
        else {
            for (let i = currentPage; i < currentPage + NUMER_OF_PAGES_TO_SHOW_IN_NAVIGATION; i++) {
                numbersArray.push(i);
            }

            numbersArray.unshift("1..");
            numbersArray.push(`..${totalPages}`);
            return numbersArray;
        }
    }
}

const Pagination = ({ pageInfo, navigationPageName, setLoadingStatus }) => {

    const { itemsCount, itemsPerPage, currentPage } = pageInfo;

    const [pageNumbersToDisplay, setpageNumbersToDisplay] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        let totalPages = Math.ceil(Number(itemsCount) / Number(itemsPerPage));
        setTotalPages(totalPages);
        setpageNumbersToDisplay(pageNumbersToDisplay => calculatePagesDisplayNumber(totalPages, Number(currentPage)));
    }, []);

    useEffect(() => {
        let totalPages = Math.ceil(Number(itemsCount) / Number(itemsPerPage));
        setTotalPages(totalPages);
        setpageNumbersToDisplay(pageNumbersToDisplay => calculatePagesDisplayNumber(totalPages, Number(currentPage)));
    }, [currentPage]);

    const navigate = useNavigate();

    const goToNextPage = () => {
        setLoadingStatus(true);
        navigate(`..//${navigationPageName}/page/${Number(currentPage) + 1}`);
    }

    const goToPreviousPage = () => {
        setLoadingStatus(true);
        navigate(`..//${navigationPageName}/page/${Number(currentPage) - 1}`);
    }

    const gotoPage = (e) => {
        setLoadingStatus(true);
        navigate(`..//${navigationPageName}/page/${Number(e.target.textContent.replace("..", ""))}`);
    }


    return (
        <ul className="page">
            {currentPage != 1 && <li className="page__numbers" ><button onClick={() => goToPreviousPage()} ><FontAwesomeIcon icon={faLeftLong} /></button></li>}

            {pageNumbersToDisplay.map(p => p == currentPage
                ? <li className="page__numbers active" key = {p} >{p} </li>
                : <li className="page__numbers " onClick={gotoPage} key = {p} >{p} </li>)}

            {currentPage != totalPages && <li className="page__numbers" ><button onClick={() => goToNextPage()} ><FontAwesomeIcon icon={faRightLong} /></button></li>}

        </ul>
    );

}

export default Pagination;