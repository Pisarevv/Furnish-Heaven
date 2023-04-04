/**
 * cartService 
 * ---------------------
 * The service responsible for the CRUD operations of the user cart.
 * ---------------------- 
**/

import { FormatCartSearchIds } from "../utils/Common";
import * as api from "./api";


export async function getUserCartItems(id){
   let result = await api.get(`/data/userCarts?where=${encodeURIComponent(`_ownerId="${id}"`)}`);
   return result;
}

export async function addProductToCartById(_productId,isStoreProduct){
    let result = await api.post('/data/userCarts',{_productId,isStoreProduct});
    return result;
}

export async function removeProductFromCartById(id){
    let result = await api.delete(`/data/userCarts/${id}`);
    return result;
}

export async function getAllUserProductsForCart(idsUrl){
    let result = await api.get(`/data/userProducts?select=${encodeURIComponent("_id,model,price,imgUrl")}&where=${encodeURI(`_id IN (${FormatCartSearchIds(idsUrl)})`)}`)
    
    return result;
}

export async function getAllStoreProductsForCart(idsUrl){
    let result = await api.get(`/data/storeProducts?select=${encodeURIComponent("_id,model,price,imgUrl")}&where=${encodeURI(`_id IN (${FormatCartSearchIds(idsUrl)})`)}`)
    
    return result;
}
