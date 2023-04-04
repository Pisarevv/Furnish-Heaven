/**
 * userProductReducer 
 * ---------------------
 * Reducer used in create and edit user listing storing their state.
 * ---------------------- 
**/

function userProductReducer(state, action) {

    switch (action.type) {
        case "SET_CATEGORY":
            return { ...state, category: action.payload, categoryError: "" };
        case "SET_DESCRIPTION":
            return { ...state, description: action.payload, descriptionError: "" };
        case "SET_IMGURL":
            return { ...state, imgUrl: action.payload, imgUrlError: "" };
        case "SET_MODEL":
            return { ...state, model: action.payload, modelError: "" };
        case "SET_TYPE":
            return { ...state, type: action.payload, typeError: "" };
        case "SET_PRICE":
            return { ...state, price: action.payload, priceError: "" };
        case "SET_YEAR":
            return { ...state, year: action.payload, yearError: "" };
        case "SET_CATEGORY_ERROR":
            return { ...state, categoryError: action.payload };
        case "SET_DESCRIPTION_ERROR":
            return { ...state, descriptionError: action.payload };
        case "SET_IMGURL_ERROR":
            return { ...state, imgUrlError: action.payload };
        case "SET_MODEL_ERROR":
            return { ...state, modelError: action.payload };
        case "SET_TYPE_ERROR":
            return { ...state, typeError: action.payload };
        case "SET_PRICE_ERROR":
            return { ...state, priceError: action.payload };
        case "SET_YEAR_ERROR":
            return { ...state, yearError: action.payload };
        default:
            return state;
    }
}

export default userProductReducer;