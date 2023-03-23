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
    let searchString = "";
    idsUrl.forEach(x => searchString += `"${x}",`);
    let slicedString = searchString.slice(0, searchString.length-1);
    console.log(
        encodeURI(`_id IN (${slicedString})`)
    )
    let result = await api.get(`/data/userProducts?where=${encodeURI(`_id IN (${slicedString})`)}`)
    // console.log(idsUrl);
    // let result =  await api.get(`/data/userProducts?where=_id%20IN%20%28%22chf54df6-2d99-4bfe-b7dc-4d4b4e4f6f8c%22%2C%20%22fdg67tyu-9ijk-2mnb-8vfr-1qaz5tgb3ed%22%2C%20%22abc23def-4ghi-5jkl-6mno-7pqr8stu9v%22%29`)
    return result;
}

