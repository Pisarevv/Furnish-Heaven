/**
 * CreateUserProduct Component
 * ---------------------
 * This component displays a form that is available for registered user.
 * The user can create a listing of a product by filling the category, description, image url, model ,type, 
 * price and year fields. 
 * If all fields are valid a listing is created.
 * ---------------------- 
 * 
 * States:
 * ----------------------
 * - userProduct (object): This object contains the properties of the product
 *   and errors that can occur on them. The userProduct is controlled by a reducer.
 * ---------------
 * 
 * Functions:
 * -----------------
 * - onInputChange:
 *  Generic function updating the userProduct of a property.
 * - validateTextFields:
 *  Function that validates that a field is not blank.
 *  There is a possibility to add different validation.
 * - validateNumberFields:
 *  Function that validates fields that a field is not blank and contains digits only.
 *  There is a possibility to add different validation.
 * - onProductCreate:
 *  Function that creates the product if all of the properties are valid.
 *  If the request is successful it redirects to the user products listing page - ("/recylce").
 * -----------------
 * 
 * - ErrorHandler
 *  This is a custom function that handles errors thrown by the REST api  
 *  and based on the error shows the user notifications.
 * -----------------
**/


import { useReducer } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { ErrorHandler } from "../../utils/ErrorHandler/ErrorHandler";

import { createUserProduct } from "../../services/userProductsService";

import userProductReducer from "../../reducers/userProductReducer";

import "./CreateUserProduct.css";

const ValidationErrors = {
    emptyInput: "This field cannot be empty",
    inputNotNumber: "This field accepts only valid numbers"
}

const ValidationRegexes = {
    //Validates that the price is a positive double, integer or decimal number
    priceRegex: new RegExp(/^(\d+(\.\d*)?|\.\d+)$/),
    //Validates that the year is an integer 
    yearRegex: new RegExp(/^[0-9]*$/)
}

const CreateUserProduct = () => {

    const navigate = useNavigate();

    const [userProduct, dispatch] = useReducer(userProductReducer, {
        category: "",
        description: "",
        imgUrl: "",
        model: "",
        price: "",
        type: "",
        year: "",

        categoryError: "",
        descriptionError: "",
        imgUrlError: "",
        modelError: "",
        priceError: "",
        typeError: "",
        yearError: ""
    })

    //Event handlers
    const onInputChange = (e) => {
        dispatch({ type: `SET_${(e.target.name).toUpperCase()}`, payload: e.target.value })
    }

    const validateTextFields = (target, value) => {
        if (value.trim() === "") {
            dispatch({ type: `SET_${target.toUpperCase()}_ERROR`, payload: ValidationErrors.emptyInput });
            return false;
        }
        return true;
    }

    const validateNumberFields = (target, value) => {
        if (target === "price") {
            if (!ValidationRegexes.priceRegex.test(value) || value.trim() === "") {
                dispatch({ type: `SET_${target.toUpperCase()}_ERROR`, payload: ValidationErrors.inputNotNumber });
                return false;
            }
            return true;
        }
        if (target === "year") {
            if (!ValidationRegexes.yearRegex.test(value) || value.trim() === "") {
                dispatch({ type: `SET_${target.toUpperCase()}_ERROR`, payload: ValidationErrors.inputNotNumber });
                return false;
            }
            return true;
        }
    }

    const onProductCreate = async (e) => {
        e.preventDefault();
        try {
            let isCategoryValid = validateTextFields("category", userProduct.category);
            let isDescriptionValid = validateTextFields("description", userProduct.description);
            let isImgUrlValid = validateTextFields("imgUrl", userProduct.imgUrl);
            let isModelValid = validateTextFields("model", userProduct.model);
            let isTypeValid = validateTextFields("type", userProduct.type);
            let isPriceValid = validateNumberFields("price", userProduct.price);
            let isYearValid = validateNumberFields("year", userProduct.year);

            if (isCategoryValid && isDescriptionValid &&
                isImgUrlValid && isModelValid &&
                isTypeValid && isPriceValid &&
                isYearValid
            ) {
                let { category, description, imgUrl, model, price, type, year } = userProduct;
                await createUserProduct({ category, description, imgUrl, model, price, type, year });
                navigate("/recycle/page/1");

            }
            else {
                throw "Invalid input fields"
            }

        } catch (error) {
            ErrorHandler(error)
        }
    }


    return (
        <section className="createProduct">
            <div className="create-container">
                <div className="create-item">
                    <div className="create-heading">
                        <h2>Create listing</h2>
                        <form onSubmit={onProductCreate}>
                            <div className="input-group input-group-lg">
                                <label>Category:</label>
                                <input className="form-control" type="text" placeholder="Category" name="category" value={userProduct.category} onChange={onInputChange} />
                                {userProduct.categoryError && <p>{userProduct.categoryError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <label>Description:</label>
                                <input className="form-control" type="text" placeholder="Description" name="description" value={userProduct.description} onChange={onInputChange} />
                                {userProduct.descriptionError && <p>{userProduct.descriptionError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <label>Image URL:</label>
                                <input className="form-control" type="text" placeholder="Image URL" name="imgUrl" value={userProduct.imgUrl} onChange={onInputChange} />
                                {userProduct.imgUrlError && <p>{userProduct.imgUrlError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <label>Model:</label>
                                <input className="form-control" type="text" placeholder="Model" name="model" value={userProduct.model} onChange={onInputChange} />
                                {userProduct.modelError && <p>{userProduct.modelError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <label>Product type:</label>
                                <input className="form-control" type="text" placeholder="Product type" name="type" value={userProduct.type} onChange={onInputChange} />
                                {userProduct.typeError && <p>{userProduct.typeError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <label>Year:</label>
                                <input className="form-control" type="text" placeholder="Year" name="year" value={userProduct.year} onChange={onInputChange} />
                                {userProduct.yearError && <p>{userProduct.yearError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <label>Price:</label>
                                <input className="form-control" type="text" placeholder="Price" name="price" value={userProduct.price} onChange={onInputChange} />
                                {userProduct.priceError && <p>{userProduct.priceError}</p>}
                            </div>
                            <button type="submit" className="float">Create listing</button>
                            <NavLink className="float" to={`/recycle/page/1`}>Cancel</NavLink>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    )
}


export default CreateUserProduct;