export function FormatCartSearchIds(inputIds) {
    let buffer = "";
    inputIds.forEach(x => buffer += `"${x}",`);
    let formatedIds = buffer.slice(0, buffer.length-1);
    return  formatedIds;
}

export function AssignCartRecordIdToProductId(cartRecordIds,products){
    products.forEach(product => {
        cartRecordIds.forEach(record => {
            if(product._id == record.productId){
                product.cartRecId = record.cartRecId;
            }
        })
    })

    return products;
}

export function CheckAreAllElementsValid (inputCollection) {
    return inputCollection.some(x => x === false) ? false : true;
}
