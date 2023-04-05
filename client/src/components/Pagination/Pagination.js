import { faLeftLong, faRightLong, } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AMOUNT_OF_PAGENUMBERS = 4;

function calculatePagesDisplayNumbering(totalPages, currentPage) {
    let numbersArray = [];
    if (totalPages <= AMOUNT_OF_PAGENUMBERS) {

        for (let i = 1; i <= totalPages; i++) {
            numbersArray.push(i);
        }
        return numbersArray;
    }
    else {
        if (currentPage == 1) {

            for (let i = currentPage + 1; i < currentPage + AMOUNT_OF_PAGENUMBERS ; i++) {
                numbersArray.push(i);
            }
            numbersArray.push(`..${totalPages}`);
            numbersArray.unshift(1);
            return numbersArray;

        }

        if(currentPage + AMOUNT_OF_PAGENUMBERS > totalPages){
            for (let i = totalPages; i > totalPages - AMOUNT_OF_PAGENUMBERS; i--) {
                numbersArray.push(i);
            }
            numbersArray.reverse();
            numbersArray.unshift("1..");

            return numbersArray;
        }
        else {
            for (let i = currentPage; i < currentPage + AMOUNT_OF_PAGENUMBERS; i++) {
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
        setpageNumbersToDisplay(pageNumbersToDisplay => calculatePagesDisplayNumbering(totalPages, Number(currentPage)));
    }, []);

    useEffect(() => {
        let totalPages = Math.ceil(Number(itemsCount) / Number(itemsPerPage));
        setTotalPages(totalPages);
        setpageNumbersToDisplay(pageNumbersToDisplay => calculatePagesDisplayNumbering(totalPages, Number(currentPage)));
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