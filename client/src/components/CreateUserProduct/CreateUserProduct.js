import { useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useFirstTouched from "../../hooks/useFirstTouched";
import useIsValid from "../../hooks/useIsValid";
import userProductReducer from "../../reducers/userProductReducer";
import { createUserProduct } from "../../services/userProductsService";
import { CheckAreAllElementsValid } from "../../utils/Common";
import { ErrorHandler } from "../../utils/ErrorHandler/ErrorHandler";
import "./CreateUserProduct.css";

const ValidationErrors = {
    emptyInput: "This field cannot be empty",
    inputNotNumber: "This field accepts only valid numbers"
}

const ValidationRegexes = {
    priceRegex: new RegExp(/^(\d+(\.\d*)?|\.\d+)$/),
    yearRegex: new RegExp(/^[0-9]*$/)
}

const CreateUserProduct = () => {

    const navigate = useNavigate();

    const [state, dispatch] = useReducer(userProductReducer, {
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
            let isCategoryValid = validateTextFields("category", state.category);
            let isDescriptionValid = validateTextFields("description", state.description);
            let isImgUrlValid = validateTextFields("imgUrl", state.imgUrl);
            let isModelValid = validateTextFields("model", state.model);
            let isTypeValid = validateTextFields("type", state.type);
            let isPriceValid = validateNumberFields("price", state.price);
            let isYearValid = validateNumberFields("year", state.year);

            if (isCategoryValid && isDescriptionValid &&
                isImgUrlValid && isModelValid &&
                isTypeValid && isPriceValid &&
                isYearValid
            ) {
                let {category,description,imgUrl,model,price,type,year} = state;
                await createUserProduct({category,description,imgUrl,model,price,type,year});
                navigate("/recycle");

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
                                <input className="form-control" type="text" placeholder="Category" name="category" value={state.category} onChange={onInputChange} />
                                {state.categoryError && <p>{state.categoryError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Description" name="description" value={state.description} onChange={onInputChange} />
                                {state.descriptionError && <p>{state.descriptionError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Image URL" name="imgUrl" value={state.imgUrl} onChange={onInputChange} />
                                {state.imgUrlError && <p>{state.imgUrlError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Model" name="model" value={state.model} onChange={onInputChange} />
                                {state.modelError && <p>{state.modelError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Product type" name="type" value={state.type} onChange={onInputChange} />
                                {state.typeError && <p>{state.typeError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Year" name="year" value={state.year} onChange={onInputChange} />
                                {state.yearError && <p>{state.yearError}</p>}
                            </div>
                            <input className="form-control" type="text" placeholder="Price" name="price" value={state.price} onChange={onInputChange} />
                                {state.priceError && <p>{state.priceError}</p>}
                            <div className="input-group input-group-lg">

                            </div>
                            <button type="submit" className="float">Create listing</button>
                            <button type="submit" className="float">Cancel</button>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    )
}


export default CreateUserProduct;