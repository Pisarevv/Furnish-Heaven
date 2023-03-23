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
    // console.log(idsUrl);
    // let result =  await api.get(`/data/userProducts?where=_id%20IN%20%28%22chf54df6-2d99-4bfe-b7dc-4d4b4e4f6f8c%22%2C%20%22fdg67tyu-9ijk-2mnb-8vfr-1qaz5tgb3ed%22%2C%20%22abc23def-4ghi-5jkl-6mno-7pqr8stu9v%22%29`)
    return result;
}

