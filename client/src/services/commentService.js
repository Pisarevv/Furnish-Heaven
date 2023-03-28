import * as api from "./api"

export async function createComment (_productId,text) {
    let result = await api.post('/comments',{_productId,text});
    return result;
}