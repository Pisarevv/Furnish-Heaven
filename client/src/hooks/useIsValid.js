import { useState } from "react";

const useIsValid = () => {
    const [isValid,setIsValid] = useState(false);

    const setValidHandler = () => {
        setIsValid(true);
    }

    const setInvalidHandler = () => {
        setIsValid(false);
    }

    return {isValid,setValidHandler,setInvalidHandler}
}


export default useIsValid;