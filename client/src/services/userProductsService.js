/**
 * userProductsService 
 * ---------------------
 * The service responsible for the CRUD operations of the user products listings.
 * ---------------------- 
**/

import * as api from "./api";

export async function getAllUserProducts (page,pageSize) {
    const targetPage = (page - 1 ) * pageSize;
    let [fetchedUserProducts,userProductsCount] = await Promise.all([
        api.get(`/data/userProducts?select=${encodeURIComponent("_id,model,price,imgUrl")}&offset=${targetPage}&pageSize=${pageSize}`),
        api.get(`/data/userProducts?count`)
    ])
    // let results = await api.get(`/data/userProducts?select=${encodeURIComponent("_id,model,price,imgUrl,rating")}&offset=${targetPage}&pageSize=${pageSize}`);
    return (
        {
        fetchedUserProducts,
        userProductsCount 
        }
    )
  
}


export async function getUserProductById(id){
    let result = await api.get(`/data/userProducts/${id}`);
    return result;
}

export async function updateUserProductById(id,data){
    await api.put(`/data/userProducts/${id}`,data);
}

export async function deleteUserProductById(id){
    await api.delete(`/data/userProducts/${id}`);
}

export async function createUserProduct(data){
    await api.post('/data/userProducts',data);
}