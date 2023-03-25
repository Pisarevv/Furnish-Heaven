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
          setProducts(products => productData);
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
      if(products.some(p => p._id == id)){
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