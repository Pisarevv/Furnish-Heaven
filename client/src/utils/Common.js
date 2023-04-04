//Function for formatting the input ids to be compatable for encoding in a "where" clause
export function FormatCartSearchIds(inputIds) {
    let buffer = "";
    inputIds.forEach(x => buffer += `"${x}",`);
    let formatedIds = buffer.slice(0, buffer.length-1);
    return  formatedIds;
}

//Function for assigning the Id of the record in the user cart based on the product
export function AssignCartRecordIdToProductId(cartRecordIds,products){
    products.forEach(product => {
        cartRecordIds.forEach(record => {
            if(product._id === record.productId){
                product.cartRecId = record.cartRecId;
            }
        })
    })

    return products;
}

//Function that checks if all elements in a collection are true
export function CheckAreAllElementsValid (inputCollection) {
    return inputCollection.some(x => x === false) ? false : true;
}
