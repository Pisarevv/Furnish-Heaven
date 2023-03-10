import { useEffect } from "react"
import "./About.css"

const About = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    return (
        <section className="about">
            <div className="about-container">
                <div className="catalog-text">
                    <h1>About us</h1>
                    <p>Welcome to our luxury furniture store where elegance meets functionality. We are committed to providing you with the highest quality furniture pieces that are not only beautiful but also functional and durable. Our collection of luxurious and modern furniture items are designed to transform your living space into an inviting and relaxing environment.</p>
                    <p>At our store, we understand that the furniture you choose for your home is a reflection of your personal style and taste. That's why we offer a wide range of furniture options that cater to all styles and preferences. Whether you are looking for classic or contemporary furniture, we have something to suit your taste.</p>
                    <p>As a company, we are also committed to preserving the environment and reducing our carbon footprint. We understand that furniture is not something that you buy every day, and when it is time to get rid of old pieces, it can be a difficult and overwhelming process. That's why we have introduced a unique service that allows you to sell your old furniture items to us.</p>
                    <p>Our aim is to help reduce waste by giving your old furniture a new lease of life. We believe that by reusing and recycling old furniture, we can help to reduce the environmental impact of furniture production. By choosing our store, you are making a conscious decision to reduce your carbon footprint and make a positive impact on the environment.</p>
                    <p>We pride ourselves on our exceptional customer service and attention to detail. Our team of experts is always on hand to assist you with any questions or concerns you may have. We are passionate about providing you with the best possible experience, from the moment you step into our store, to the moment your new furniture is delivered to your home.</p>
                    <p>In summary, our luxury furniture store is the perfect destination for those looking for quality and elegance in their home furnishings. We offer a wide range of furniture options that cater to all styles and preferences. Additionally, our unique service that allows you to sell your old furniture items to us, gives you the opportunity to make a positive impact on the environment while still enjoying beautiful and functional furniture in your home. So, why not visit our store and experience the luxury of our furniture for yourself?</p>
                </div>     
            </div>
        
        </section>
    )
}


export default About;