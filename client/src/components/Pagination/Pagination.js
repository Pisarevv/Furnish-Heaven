import { faLeftLong, faRightLong,  } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom';

const currentPage = 1;

const Pagination = ({pageInfo,navigationPageName,setLoadingStatus}) => {

    const {itemsPerPage,totalPages,currentPage} = pageInfo;
    // const {setLoadingStatus} = setLoading;
    console.log(setLoadingStatus);

    const navigate = useNavigate();

    const goToNextPage = () => {
        setLoadingStatus(true);
        navigate(`../${navigationPageName}/${Number(currentPage) + 1}`);
    }

    const goToPreviousPage = () => {
        // setLoading(true);
        navigate(`../${navigationPageName}/${Number(currentPage) - 1}`);
    }



    // console.log(pageInfo)
    // console.log(goToNextPage)
    return (
        <ul className="page">
        <li className="page__numbers" ><button onClick={() => goToPreviousPage() } ><FontAwesomeIcon icon={faLeftLong} /></button></li>
        <li className="page__numbers">1</li>
        <li className="page__numbers active">2</li>
        <li className="page__numbers">3</li>
        <li className="page__numbers">4</li>
        <li className="page__numbers">5</li>
        <li className="page__numbers">6</li>
        <li className="page__dots">...</li>
        <li className="page__numbers"> {totalPages}</li>
        <li className="page__numbers" ><button onClick={() => goToNextPage() } ><FontAwesomeIcon icon={faRightLong} /></button></li>
    </ul>
    );

}

export default Pagination;