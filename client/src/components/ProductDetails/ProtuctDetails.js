import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getProductById } from "../../services/storeProductsService";
import "./ProductDetails.css";

const ProductDetails = () => {

    const [productInfo, setProductInfo] = useState("");
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            const result = await getProductById(id)
            setProductInfo(result);
            console.log(productInfo)
        }
        )()
    }, [])

    return (
        <section className="details-wrapper">
            <div className="details-container">
                <div className="details-product-wrapper">
                    <div className="details-product-container">
                        <div className="details-product-top">
                            <img src = {productInfo.imgUrl}></img>
                        </div>

                        <div className="details-product-bottom">
                            <div className="details-product-left">
                                <div className="details-product-details">
                                    <p>Category :{productInfo.category}</p>
                                    <p>Model: {productInfo.model}</p>
                                    <p>Collection year : {productInfo.year}</p>
                                    <p>{productInfo.description}</p>
                                    <p>Material: {productInfo.material}</p>
                                    <p>Rating : {productInfo.rating}</p>

                                    <NavLink className="sell-btn" to="/">Purchuse</NavLink>
                                    <NavLink className="sell-btn" to="/">Edit</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default ProductDetails;

