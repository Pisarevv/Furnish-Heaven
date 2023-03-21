import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./EditUserProduct.css";

const EditUserProduct = () => {

    const { id } = useParams();
    const [productDetails, setProductDetails] = useState();

    const onInputChange = (e) => {
        e.preventDefault();
        productDetailsInput.current[e.target.name] = e.target.value;

        // console.log(e.target.name);
        console.log(productDetailsInput.current[e.target.name])
        // console.log(e),
        // console.log(e.target),
        // console.log(e.target.value)
    }



    const productDetailsInput = useRef({
        category: "",
        description: "",
        imgUrl: "",
        model: "",
        price: 0,
        type: "",
        year: 0
    })

    useEffect(() => {
        (async () => {

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
                                <input className="form-control" type="text" placeholder="Category" name="category" refer={productDetailsInput.current.category} onChange={onInputChange} onBlur={() => console.log(productDetailsInput)} />
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Description" name="description" refer={productDetailsInput.current.description} onChange={onInputChange} onBlur={() => console.log(productDetailsInput)} />
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Image URL" name="imgUrl" refer={productDetailsInput.current.imgUrl} onChange={onInputChange} onBlur={() => console.log(productDetailsInput)} />
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Model" name="model" refer={productDetailsInput.current.model} onChange={onInputChange} onBlur={() => console.log(productDetailsInput)} />
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Product type" name="type" refer={productDetailsInput.current.type} onChange={onInputChange} onBlur={() => console.log(productDetailsInput)} />
                            </div>
                            <div className="input-group input-group-lg">
                                <input className="form-control" type="text" placeholder="Year" name="year" refer={productDetailsInput.current.year} onChange={onInputChange} onBlur={() => console.log(productDetailsInput)} />
                            </div>  <input className="form-control" type="text" placeholder="Price" name="price" refer={productDetailsInput.current.price} onChange={onInputChange} onBlur={() => console.log(productDetailsInput)} />
                            <div className="input-group input-group-lg">

                            </div>
                            <button type="submit" className="float">Save changes</button> 
                            <button type="submit" className="float">Clear fields</button>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    )
}


export default EditUserProduct;
