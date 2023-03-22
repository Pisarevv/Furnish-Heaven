import * as api from "./api";


export async function getUserCartItems(id){
   let result = await api.get(`/data/userCarts?where=${encodeURIComponent(`_ownerId="${id}"`)}`);
   return result;
}
