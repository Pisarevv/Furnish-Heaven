import { useState } from "react"
import LoadingComponent from "./LoadingComponent";


const IsLoadingHOC = (WrappedComponent) => {
    function HOC(props) {
        const [isLoading, setLoading] = useState(true);

        const setLoadingState = (isComponentLoading) => {
            setLoading(isComponentLoading);
        };

        return (
            <>
                {isLoading && <LoadingComponent />}
                <WrappedComponent {...props} setLoading={setLoadingState} />
            </>
        );
    };

    return HOC;
}

export default IsLoadingHOC;