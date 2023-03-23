export function FormatCartSearchIds(inputIds) {
    let buffer = "";
    inputIds.forEach(x => buffer += `"${x}",`);
    let formatedIds = buffer.slice(0, buffer.length-1);
    return  formatedIds;
}