import { Store } from 'react-notifications-component';

export function FormatCartSearchIds(inputIds) {
    let buffer = "";
    inputIds.forEach(x => buffer += `"${x}",`);
    let formatedIds = buffer.slice(0, buffer.length-1);
    return  formatedIds;
}

export const AlertHandler = (title,message,type) => {
    return (
        Store.addNotification({
            title: title,
            message: message,
            type: type,
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true
            }
        })
    )
}