

const CartProduct = () => {
    return (
        <li class="items even">

            <div class="infoWrap">
                <div class="cartSection">

                    <img src="http://lorempixel.com/output/technics-q-c-300-300-4.jpg" alt="" class="itemImg" />
                    <p class="itemNumber">#QUE-007544-002</p>
                    <h3>Item Name 1</h3>

                    <p> <input type="text" class="qty" placeholder="3" /> x $5.00</p>

                    <p class="stockStatus"> In Stock</p>
                </div>


                <div class="prodTotal cartSection">
                    <p>$15.00</p>
                </div>
                <div class="cartSection removeWrap">
                    <a href="#" class="remove">x</a>
                </div>
            </div>
        </li>
    )
}

export default CartProduct;