import { FormatCartSearchIds } from "../utils/Common";
import * as api from "./api";


export async function getUserCartItems(id){
   let result = await api.get(`/data/userCarts?where=${encodeURIComponent(`_ownerId="${id}"`)}`);
   return result;
}

export async function addProductToCartById(_ownerId,_productId){
    let result = await api.post('/data/userCarts',{_ownerId,_productId});
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

