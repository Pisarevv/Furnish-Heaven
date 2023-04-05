import { faLeftLong, faRightLong, } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// const currentPage = 1;

function calculatePagesDisplayNumbering(totalPages,currentPage) {
    let numbersArray = [];
    if (totalPages < 4) {

        for (let i = 1; i <= totalPages; i++) {
            numbersArray.push(i);
        }
        return numbersArray;
    }
    else {
       for (let i = currentPage + 1 ; i  <=  currentPage + 3; i++) {
            numbersArray.push(i);
        }

        numbersArray.unshift(1);
        numbersArray.push(totalPages);


        return numbersArray;
    }
}


const Pagination = ({ pageInfo, navigationPageName, setLoadingStatus }) => {

    const { storeProductsCount, itemsPerPage, currentPage } = pageInfo;

    const [pageNumbersToDisplay, setpageNumbersToDisplay] = useState([]);

        useEffect(() =>{
            let totalPages = Number(storeProductsCount)/Number(itemsPerPage);
            setpageNumbersToDisplay(calculatePagesDisplayNumbering(10,Number(currentPage)));
        },[]);

    console.log(pageNumbersToDisplay);


    const navigate = useNavigate();

    const goToNextPage = () => {
        setLoadingStatus(true);
        navigate(`../${navigationPageName}/${Number(currentPage) + 1}`);
    }

    const goToPreviousPage = () => {
        setLoadingStatus(true);
        navigate(`../${navigationPageName}/${Number(currentPage) - 1}`);
    }


    return (
        <ul className="page">
            <li className="page__numbers" ><button onClick={() => goToPreviousPage()} ><FontAwesomeIcon icon={faLeftLong} /></button></li>
            
            {pageNumbersToDisplay.map(p =>  p == currentPage 
            ? <li className="page__numbers active">{p} </li> 
            : <li className="page__numbers ">{p} </li>)}
            {/* <li className="page__numbers">1</li>
            <li className="page__numbers active">2</li>
            <li className="page__numbers">3</li>
            <li className="page__numbers">4</li>
            <li className="page__numbers">5</li>
            <li className="page__numbers">6</li>
            <li className="page__dots">...</li>
            <li className="page__numbers"> 4324</li> */}
            <li className="page__numbers" ><button onClick={() => goToNextPage()} ><FontAwesomeIcon icon={faRightLong} /></button></li>
        </ul>
    );

}

export default Pagination;