import { useState } from "react";

const useLocalStorage = (key, defaultValue) => {

    const [value, setValue] = useState(() => {
        const storedData = localStorage.getItem(key);

        return storedData ? JSON.parse(storedData) : defaultValue;
    });

    const setLocalStorageValue = (value) => {
        localStorage.setItem(key, JSON.stringify(value));
        setValue(value);    
    };

    return [value, setLocalStorageValue]


}

export default useLocalStorage;