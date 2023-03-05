import * as api from "./api";

const minRating = 5;

export async function getTrendingProducts () {
    let results = await api.get(`/data/storeProducts?select=${encodeURIComponent("_id,model,price,imgUrl,rating")}&where=${encodeURIComponent("rating>=minRating")}`);
    return results.json();
}