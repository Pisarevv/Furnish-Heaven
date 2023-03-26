import * as api from "./api";

const minRating = 5;


export async function getTrendingProducts () {
    let results = await api.get(`/data/storeProducts?select=${encodeURIComponent("_id,model,price,imgUrl,rating,description")}&where=${encodeURIComponent(`rating>=${minRating}`)}&pageSize=4`);
    return results;
}

export async function getStoreProductById(id){
    let result = await api.get(`/data/storeProducts/${id}`);    
    return result;
}


