import { useState } from "react";

const useFirstTouched = () => {
    const [touched, setTouched] = useState(false);

    const handleOnTouch = () => {
        setTouched(true);
    };

    return {touched,handleOnTouch};
    
}

export default useFirstTouched;