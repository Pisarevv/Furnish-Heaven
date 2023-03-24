import { Store } from 'react-notifications-component';


const errors = {
    "Invalid access token" : {
        title : "Invalid access token",
        message : "Your session has expired Please log in again.",
        type : "warning"
    },
    "Login or password don\'t match" : {
        title : "Invalid credentials",
        message : "Login or password don\'t match",
        type : "warning"
    },
    "Invalid register fields" : {
        title : "Invalid input",
        message : "All fields must be valid",
        type : "warning"
    },
}




export const ErrorHandler = (inputError) => {
    const {title,message,type} = errors[inputError];
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