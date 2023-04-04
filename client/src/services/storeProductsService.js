/**
 * storeProductsService 
 * ---------------------
 * The service responsible for the CRUD operations of the store products.
 * ---------------------- 
**/

import * as api from "./api";

const minRating = 5;


export async function getTrendingProducts () {
    let result = await api.get(`/data/storeProducts?select=${encodeURIComponent("_id,model,price,imgUrl,rating,description")}&where=${encodeURIComponent(`rating>=${minRating}`)}&pageSize=4`);
    return result;
}

export async function getAllStoreProducts () {
    let result = await api.get(`/data/storeProducts?select=${encodeURIComponent("_id,model,price,imgUrl,rating,description")}`);
    return result;
}

export async function getStoreProductById(id){
    let result = await api.get(`/data/storeProducts/${id}`);    
    return result;
}


