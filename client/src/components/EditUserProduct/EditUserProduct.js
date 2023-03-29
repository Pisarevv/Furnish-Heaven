import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFirstTouched from "../../hooks/useFirstTouched";
import useIsValid from "../../hooks/useIsValid";
import { getUserProductById, updateUserProductById } from "../../services/userProductsService";
import { CheckAreAllElementsValid } from "../../utils/Common";
import { ErrorHandler } from "../../utils/ErrorHandler/ErrorHandler";
import "./EditUserProduct.css";

const ValidationErrors = {
    emptyInput: "This field cannot be empty",
    inputNotNumber: "This field accepts only valid numbers"
}

const ValidationRegexes = {
    priceRegex: new RegExp(/^(\d+(\.\d*)?|\.\d+)$/),
    yearRegex: new RegExp(/^[0-9]*$/)
}

const EditUserProduct = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const isCategoryValid = useIsValid();
    const categoryTouched = useFirstTouched();

    const isDescriptionValid = useIsValid();
    const descriptionTouched = useFirstTouched();

    const isImgUrlValid = useIsValid();
    const imgUrlTouched = useFirstTouched();

    const isModelValid = useIsValid();
    const modelTouched = useFirstTouched();

    const isPriceValid = useIsValid();
    const priceTouched = useFirstTouched();

    const isTypeValid = useIsValid();
    const typeTouched = useFirstTouched();

    const isYearValid = useIsValid();
    const yearTouched = useFirstTouched();

    const [productDetails, setProductDetails] = useState({
        category: "",
        description: "",
        imgUrl: "",
        model: "",
        price: "",
        type: "",
        year: ""
    });

    useEffect(() => {
        (async () => {
            const result = await getUserProductById(id)
            setProductDetails(result);
            isCategoryValid.setValidHandler();
            isDescriptionValid.setValidHandler();
            isImgUrlValid.setValidHandler();
            isModelValid.setValidHandler();
            isPriceValid.setValidHandler();
            isTypeValid.setValidHandler();
            isYearValid.setValidHandler();
        })()
    }, [])


    const onInputChange = (e) => {
        e.preventDefault();
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value
        });
        console.log(productDetails[e.target.name])
    }

    const onInputValidate = (e) => {
        e.preventDefault();
        let fieldName = e.target.name;
        let value = e.target.value;
        console.log(categoryTouched)

        switch (fieldName) {
            case "category": {
                categoryTouched.handleOnTouch();
                if (value.trim() === "") {
                    isCategoryValid.setInvalidHandler();
                }
                else {
                    isCategoryValid.setValidHandler();
                }
                break;
            }
            case "description": {
                descriptionTouched.handleOnTouch();
                if (value.trim() === "") {
                    isDescriptionValid.setInvalidHandler();
                }
                else {
                    isDescriptionValid.setValidHandler();
                }
                break;
            }
            case "imgUrl": {
                imgUrlTouched.handleOnTouch();
                if (value.trim() === "") {
                    isImgUrlValid.setInvalidHandler();
                }
                else {
                    isImgUrlValid.setValidHandler();
                }
                break;
            }
            case "model": {
                modelTouched.handleOnTouch();
                if (value.trim() === "") {
                    isModelValid.setInvalidHandler();
                }
                else {
                    isModelValid.setValidHandler();
                    break;
                }
            }
            case "type": {
                typeTouched.handleOnTouch();
                if (value.trim() === "") {
                    isTypeValid.setInvalidHandler();
                }
                else {
                    isTypeValid.setValidHandler();
                }
                break;
            }
            case "price": {
                priceTouched.handleOnTouch();
                if (!ValidationRegexes.priceRegex.test(value) || value.trim() === "") {
                    isPriceValid.setInvalidHandler()
                }
                else {
                    isPriceValid.setValidHandler()
                }
                break;
            }
            case "year": {
                yearTouched.handleOnTouch();
                if (!ValidationRegexes.yearRegex.test(value) || value.trim() === "") {
                    isYearValid.setInvalidHandler();
                }
                else {
                    isYearValid.setValidHandler();
                }
                break;
            }
        }
 
    }
    const onProductUpdate = async (e) => {
        e.preventDefault();
    
        try {
            let allInputsValid = CheckAreAllElementsValid([
                isCategoryValid.isValid,
                isDescriptionValid.isValid,
                isImgUrlValid.isValid,
                isModelValid.isValid,
                isTypeValid.isValid,
                isPriceValid.isValid,
                isYearValid.isValid
            ]);

            if (allInputsValid) {     
                await updateUserProductById(id, productDetails)
                navigate('/recycle');
            }
            else{
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
                                <input className="form-control" type="text" placeholder="Category" name="category" defaultValue={productDetails.category} onChange={onInputChange} onBlur={onInputValidate} />
                                {!isCategoryValid.isValid && categoryTouched.touched && <p>{ValidationErrors.emptyInput}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Description" name="description" defaultValue={productDetails.description} onChange={onInputChange} onBlur={onInputValidate} />
                                {!isDescriptionValid.isValid && descriptionTouched.touched && <p>{ValidationErrors.emptyInput}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Image URL" name="imgUrl" defaultValue={productDetails.imgUrl}onChange={onInputChange} onBlur={onInputValidate} />
                                {!isImgUrlValid.isValid && imgUrlTouched.touched && <p>{ValidationErrors.emptyInput}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Model" name="model" defaultValue={productDetails.model} onChange={onInputChange} onBlur={onInputValidate} />
                                {!isModelValid.isValid && modelTouched.touched && <p>{ValidationErrors.emptyInput}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Product type" name="type" defaultValue={productDetails.type} onChange={onInputChange} onBlur={onInputValidate} />
                                {!isTypeValid.isValid && typeTouched.touched && <p>{ValidationErrors.emptyInput}</p>}
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Year" name="year" defaultValue={productDetails.year} onChange={onInputChange} onBlur={onInputValidate} />
                                {!isYearValid.isValid && yearTouched.touched && <p>{ValidationErrors.inputNotNumber}</p>}
                            </div>
                            <input className="form-control" type="text" placeholder="Price" name="price" defaultValue={productDetails.price} onChange={onInputChange} onBlur={onInputValidate} />
                            {!isPriceValid.isValid && priceTouched.touched && <p>{ValidationErrors.inputNotNumber}</p>}
                            <div className="input-group input-group-lg">


                            </div>
                            <button type="submit" className="float">Save changes</button>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    )
}


export default EditUserProduct;
