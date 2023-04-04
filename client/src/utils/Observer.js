/**
 *  Observer
 *  This is a custom component that creates a fading in animation.
 * -----------------
**/

const Observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {
            if(entry.isIntersecting){
                entry.target.classList.add('show');
            }
        });
    
   
});


const Observe = () => {
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => Observer.observe(el));

}

export default Observe;