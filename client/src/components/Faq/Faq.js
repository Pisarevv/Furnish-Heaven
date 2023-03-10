import { useEffect } from "react"
import "./Faq.css"

const Faq = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    return (
        <section className="about">
            <div className="about-container">
                <div className="catalog-text">
                    <h1>Faq</h1>
                    <p>Q: What is the webpage about?</p>
                    <p>A: The webpage is about luxury furniture, showcasing a wide range of high-end furniture pieces for the discerning customer</p>
                    <p>As a company, we are also committed to preserving the environment and reducing our carbon footprint. We understand that furniture is not something that you buy every day, and when it is time to get rid of old pieces, it can be a difficult and overwhelming process. That's why we have introduced a unique service that allows you to sell your old furniture items to us.</p>
                    <p>Our aim is to help reduce waste by giving your old furniture a new lease of life. We believe that by reusing and recycling old furniture, we can help to reduce the environmental impact of furniture production. By choosing our store, you are making a conscious decision to reduce your carbon footprint and make a positive impact on the environment.</p>
                    <p>We pride ourselves on our exceptional customer service and attention to detail. Our team of experts is always on hand to assist you with any questions or concerns you may have. We are passionate about providing you with the best possible experience, from the moment you step into our store, to the moment your new furniture is delivered to your home.</p>
                    <p>In summary, our luxury furniture store is the perfect destination for those looking for quality and elegance in their home furnishings. We offer a wide range of furniture options that cater to all styles and preferences. Additionally, our unique service that allows you to sell your old furniture items to us, gives you the opportunity to make a positive impact on the environment while still enjoying beautiful and functional furniture in your home. So, why not visit our store and experience the luxury of our furniture for yourself?</p>
                </div>     
            </div>
        
        </section>
    )
}


export default Faq;