import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getTrendingProducts } from '../../services/storeProductsService';
import Observer from '../../utils/Observer';
import { motion } from 'framer-motion';
import './Catalog.css'
import TrendingProductCard from './TrendingProductCard';

const Catalog = () => {

    const observer = Observer;

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

    const [trendingProducts,setTrendingProducts] = useState([]);

    useEffect(() => {
      (async () => {
        const result = await getTrendingProducts();
        setTrendingProducts(trendingProducts => result);
      })()
    },[])
    
    console.log(trendingProducts);


    return (
     
        <motion.section className="catalog"
            initial = {{opacity:0.8}}
            animate = {{opacity:1}}
            exit = {{opacity:0.8}}>       
            <div className="container">
           
            <div className="welcome-container hidden">
                <div className="catalog-text">
                    <h1 className="welcome-msg hidden"><span>Your</span> home should tell the story of who you are,
                        <br className='hidden'></br>and be a collection of what you love.</h1>
                </div>              
            </div>
         

           
            <div className="introduction-container hidden">
                <p className='hidden'>Where we bring you the finest collection of furniture pieces that will transform your home into a sophisticated haven of style and comfort.</p>
                <p className='hidden'>Our exclusive collection features the finest handcrafted furniture made from the highest quality materials and designed by world-renowned artisans.</p>
                <p className='hidden'> Each piece is a masterpiece that exudes elegance, luxury, and sophistication.</p>
                <p className='hidden'></p>
                <NavLink className="explore-btn hidden" to="/">Explore our collections</NavLink>
            </div>
           
 
        
            <div className="trending-container hidden">
                <h3 className='hidden'>Trending products:</h3>
                <div className='trendingProducts-container hidden'>
                    {trendingProducts.map(x => <TrendingProductCard key={x._id} productInfo = {x} />)}
                </div>
            </div>
           

          
            <div className="resell-container hidden">
                <p className='hidden'>We fully support the idea of selling old furniture to help save the environment.</p>
                <p className='hidden'>By selling your old furniture from our website we are donating 5% of the price of the product to organizations that are helping the enviroment. 
                We believe that every small step counts towards a better future, and by selling your old furniture, you're making a significant contribution to protecting the planet.
               So, if you're looking for a sustainable and eco-friendly way to furnish your home, we're here to help.</p>
                <p className='hidden'>Thank you for supporting our mission to create a greener and more sustainable future.</p>
                <p className='hidden'></p>
                <NavLink className="sell-btn hidden" to="/">Retail your old furniture</NavLink>
            </div>
          
            </div>
           
        </motion.section>
       
    )
}


export default Catalog;

