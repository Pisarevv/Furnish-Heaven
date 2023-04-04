/**
 * CartContext 
 * ---------------------
 * React cart context and provider,
 * as well as a custom hook to access the cart state and functions in any component.
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - products (object): This state uses the custom UseLocalStorage hook that
 *   allows the state to persist even when the page is refreshed. 
 *   It contains the products that the user has added to their cart.
 * ---------------------
 * 
 * Functions: 
 * - addProductToCart, removeProductFromCart, emptyCart - These functions are used to update the cart state
 *  when a user adds or removes a product.
**/

import { createContext, useContext } from "react";

import useLocalStorage from "../hooks/useLocalStorage";

export const CartContext = createContext();

export const CartProvider = ({
    children
}) => {

    const [products,setProducts] = useLocalStorage('cart', [])

    const addProductToCart = (productData) => {
      if(products.length === 0){
        if(Array.isArray(productData)){
          setProducts(productData.slice());
        }
        else{
          let newArray = [productData]
          setProducts(newArray);
        }
      }
      else{ 
        setProducts([...products,productData].slice());
      }
    }
  
    const removeProductFromCart = (id) => {
      if(products.some(p => p._id === id)){
        setProducts(products.filter(x => x._id !== id));
      } 
    }
  
    const emptyCart = () => {
      setProducts([])
    }
  

    return (
        <CartContext.Provider value = {{cart: products, addProductToCart, removeProductFromCart, emptyCart}}>
            {children}
        </CartContext.Provider>
    );
}


export const useCartContext = () => {
  const context = useContext(CartContext);

  return context;
}