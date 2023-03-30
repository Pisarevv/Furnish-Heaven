import * as api from "./api"

export async function getProductComments(_productId){
    let result = await api.get(`/data/comments?where=${encodeURIComponent(`_productId="${_productId}"`)}&load=author%3D_ownerId%3Ausers`);
    return result;
}
export async function createComment (_productId,text) {
    let result = await api.post('/data/comments',{_productId,text});
    return result;
}

export async function deleteCommentById (id){
    let result = await api.delete(`/data/comments/${id}`);
    return result;
}

export async function editUserCommentById(id,text,_productId){
    let result = await api.put(`/data/comments/${id}`,{text,_productId});
    return result;
}