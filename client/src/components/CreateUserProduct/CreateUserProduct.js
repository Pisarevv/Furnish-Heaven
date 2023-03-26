import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createUserProduct } from "../../services/userProductsService";
import "./CreateUserProduct.css";

const CreateUserProduct = () => {
    
    const navigate = useNavigate();

    const category = useRef();
    const description = useRef();
    const imgUrl = useRef();
    const model = useRef();
    const price = useRef();
    const type = useRef();
    const year = useRef();

    const productDetailsInput = useRef({
        category: "",
        description: "",
        imgUrl: "",
        model: "",
        price: 0,
        type: "",
        year: 0
    })

    const onInputChange = (e) => {
        e.preventDefault();
        productDetailsInput.current[e.target.name] = e.target.value;
        console.log(productDetailsInput.current[e.target.name])    
    }

    const onProductCreate = async(e) => {
        e.preventDefault();

        await createUserProduct(productDetailsInput.current);
        navigate("/recycle");
    }

   
    return (
        <section className="createProduct">
            <div className="create-container">
                <div className="create-item">
                    <div className="create-heading">
                        <h2>Create listing</h2>
                        <form onSubmit={onProductCreate}>
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