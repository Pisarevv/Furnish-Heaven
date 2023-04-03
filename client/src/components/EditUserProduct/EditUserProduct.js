import { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserProductById, updateUserProductById } from "../../services/userProductsService";
import { ErrorHandler } from "../../utils/ErrorHandler/ErrorHandler";
import "./EditUserProduct.css";
import userProductReducer from "../../reducers/userProductReducer";
import IsLoadingHOC from "../Common/IsLoadingHoc";

const ValidationErrors = {
    emptyInput: "This field cannot be empty",
    inputNotNumber: "This field accepts only valid numbers"
}

const ValidationRegexes = {
    priceRegex: new RegExp(/^(\d+(\.\d*)?|\.\d+)$/),
    yearRegex: new RegExp(/^[0-9]*$/)
}

const EditUserProduct = (props) => {

    const { id } = useParams();
    const navigate = useNavigate();
     const { setLoading } = props;


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

    console.log(state);

    useEffect(() => {
        (async () => {
            const productDetails = await getUserProductById(id)
            setProductInitialDetails(productDetails);
            setLoading(false);
        })()
    }, [])
 
    const setProductInitialDetails = (productProperties) => {
        for (const property in productProperties) {
            dispatch({ type: `SET_${(property).toUpperCase()}`, payload: productProperties[property] })
            console.log(`${property}: ${productProperties[property]}`);
        }
    }


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

    const onProductUpdate = async (e) => {
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
                let { category, description, imgUrl, model, price, type, year } = state;
                await updateUserProductById(id, { category, description, imgUrl, model, price, type, year })
                navigate('/recycle');
            }

            else {
                throw "Invalid input fields"
            }

        } catch (error) {
            ErrorHandler(error)
        }

    }

    return (
        <section className="editProduct">
            <div className="edit-container">
                <div className="edit-item">
                    <div className="edit-heading">
                        <h2>Edit listing</h2>
                        <form onSubmit={onProductUpdate}>
                            <div className="input-group input-group-lg">
                                <label>Category:</label>
                                <input className="form-control" type="text" placeholder="Category" name="category" value={state.category} onChange={onInputChange} />
                                {state.categoryError && <p>{state.categoryError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <label>Description:</label>
                                <input className="form-control description" type="text" placeholder="Description" name="description" value={state.description} onChange={onInputChange} />
                                {state.descriptionError && <p>{state.descriptionError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <label>Image URL:</label>
                                <input className="form-control" type="text" placeholder="Image URL" name="imgUrl" value={state.imgUrl} onChange={onInputChange} />
                                {state.imgUrlError && <p>{state.imgUrlError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <label>Model:</label>
                                <input className="form-control" type="text" placeholder="Model" name="model" value={state.model} onChange={onInputChange} />
                                {state.modelError && <p>{state.modelError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <label>Product type:</label>
                                <input className="form-control" type="text" placeholder="Product type" name="type" value={state.type} onChange={onInputChange} />
                                {state.typeError && <p>{state.typeError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <label>Year:</label>
                                <input className="form-control" type="text" placeholder="Year" name="year" value={state.year} onChange={onInputChange} />
                                {state.yearError && <p>{state.yearError}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <label>Price:</label>
                                <input className="form-control" type="text" placeholder="Price" name="price" value={state.price} onChange={onInputChange} />
                                {state.priceError && <p>{state.priceError}</p>}
                            </div>
                            <button type="submit" className="float">Save changes</button>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    )

}
export default  IsLoadingHOC(EditUserProduct);
