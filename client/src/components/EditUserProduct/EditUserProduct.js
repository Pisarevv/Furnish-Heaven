import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProductById } from "../../services/storeProductsService";
import "./EditUserProduct.css";

const EditUserProduct = () => {

    const { id } = useParams();
    // const [productDetails, setProductDetails] = useState();

    const [productDetails, setProductDetails] = useState({})

    const onInputChange = (e) => {
        e.preventDefault();
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value
        });
        console.log(productDetails[e.target.name])

    }

    useEffect(() => {
        (async () => {
            const result = await getUserProductById(id)
            setProductDetails(result)
            console.log(productDetails)
        })()
    }, [])

    return (
        <section className="editProduct">
            <div className="edit-container">
                <div className="edit-item">
                    <div className="edit-heading">
                        <h2>Edit listing</h2>
                        <form onSubmit={() => console.log("hello")}>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" defaultValue={productDetails.category} placeholder="Category" name="category" onChange={onInputChange} onBlur={() => console.log(productDetails)} />
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" defaultValue={productDetails.description} placeholder="Description" name="description" onChange={onInputChange} onBlur={() => console.log(productDetails)} />
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" defaultValue={productDetails.imgUrl} placeholder="Image URL" name="imgUrl" onChange={onInputChange} onBlur={() => console.log(productDetails)} />
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" defaultValue={productDetails.model} placeholder="Model" name="model" onChange={onInputChange} onBlur={() => console.log(productDetails)} />
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" defaultValue={productDetails.type} placeholder="Product type" name="type" onChange={onInputChange} onBlur={() => console.log(productDetails)} />
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" defaultValue={productDetails.year} placeholder="Year" name="year" onChange={onInputChange} onBlur={() => console.log(productDetails)} />
                            </div>  <input className="form-control" type="text" defaultValue={productDetails.price} placeholder="Price" name="price" onChange={onInputChange} onBlur={() => console.log(productDetails)} />
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
