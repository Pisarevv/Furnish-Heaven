import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getTrendingProducts } from '../../services/storeProductsService';
import './Recycle.css'
import ProductCard from './ProductCard';

const Recycle = () => {

    const [trendingProducts,setTrendingProducts] = useState([]);

    useEffect(() => {
      (async () => {
        const result = await getTrendingProducts();
        setTrendingProducts(trendingProducts => result);
      })()
    },[])
    
    console.log(trendingProducts);


    return (
        <section className="catalog">
            <div className="container"> 
            <NavLink className="sell-btn" to="/">Create listing</NavLink>
            {/* <div className="welcome-container">
                <div className="catalog-text">
                    <h1 className="welcome-msg">Latest users listings</h1>
                    <NavLink className="sell-btn" to="/">Create listing</NavLink>
                </div>
               
                
            </div> */}

            {/* <div className="introduction-container">
                <p>Where we bring you the finest collection of furniture pieces that will transform your home into a sophisticated haven of style and comfort.</p>
                <p>Our exclusive collection features the finest handcrafted furniture made from the highest quality materials and designed by world-renowned artisans.</p>
                <p> Each piece is a masterpiece that exudes elegance, luxury, and sophistication.</p>
                <p></p>
                <NavLink className="explore-btn" to="/">Explore our collections</NavLink>
            </div> */}
 
            <div className="trending-container">
                <h3>Latest users listings:</h3>
                <div className='trendingProducts-container'>
                    {trendingProducts.map(x => <ProductCard key={x._id} productInfo = {x}/>)}
                 
                </div>
            </div>
{/* 
            <div className="resell-container">
                <p>We fully support the idea of selling old furniture to help save the environment.</p>
                <p>By selling your old furniture from our website we are donating 5% of the price of the product to organizations that are helping the enviroment. 
                We believe that every small step counts towards a better future, and by selling your old furniture, you're making a significant contribution to protecting the planet.
               So, if you're looking for a sustainable and eco-friendly way to furnish your home, we're here to help.</p>
                <p>Thank you for supporting our mission to create a greener and more sustainable future.</p>
                <p></p>
                <NavLink className="sell-btn" to="/">Retail your old furniture</NavLink>
            </div> */}
            </div>
        </section>
    )
}


export default Recycle;

