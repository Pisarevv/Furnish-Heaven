import * as api from "./api";


export async function getUserCartItems(id){
   let result = await api.get(`/data/userCarts?where=${encodeURIComponent(`_ownerId="${id}"`)}`);
   return result;
}

export async function addProductToCartById(_ownerId,_productId){
    let result = await api.post('/data/userCarts',{_ownerId,_productId});
    return result;
}

export async function removeProductFromCartById(_ownerId,_productId){
    let result = await api.delete(`/data/userCarts?where=${encodeURIComponent(`_ownerId="${_ownerId}"&_productId="${_productId}`)}`);
    return result;
}

