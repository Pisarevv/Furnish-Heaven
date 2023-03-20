import * as api from "./api";

const minRating = 5;

export async function getTrendingProducts () {
    let results = await api.get(`/data/storeProducts?select=${encodeURIComponent("_id,model,price,imgUrl,rating")}&where=${encodeURIComponent(`rating>=${minRating}`)}`);
    return results;
}


export async function getProductById(id){
    let result = await api.get(`/data/storeProducts/${id}`);
    return result;
}