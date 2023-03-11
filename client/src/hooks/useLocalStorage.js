import { useState } from "react";

const useLocalStorage = () => {

        const [value,setValue] = useState(null)

        const setItem = (key,value) => {
            localStorage.setItem(key,value);
            setValue(value => value);
        };

        const getItem = (key) => {
            localStorage.getItem(key);
            setValue(value => value);
            return value;
        }

        const removeItem = (key) => {
            localStorage.removeItem(key);
            setValue(value => null);
        }

        return [value,setItem,getItem,removeItem]

}

export default useLocalStorage;