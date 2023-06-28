(function () {
    class wisn_custom_checkout {
    itemsArray = []
    checkoutURL = "127.0.0.1:/132"
    
    constructor(params) {
        window.addEventListener(window.LS.events.productAddedToCart, this.updateItemsArray.bind(this));
        document.addEventListener("click", this.handleWindowEvents.bind(this));
        window.addEventListener("load", this.updateItemsArray.bind(this));

        //initial update item array
        this.updateItemsArray();

        //check ready state
        this.checkRedyState();
        
    }

    checkRedyState() {
        let readyStateCheck = setInterval(function(){
            if(document.readyState == "complete") {
                clearInterval(readyStateCheck);
                this.updateItemsArray();
            } 
        }.bind(this), 200);
    }

    handleWindowEvents(event){
        const target = event.target;

        //check if they click on checkout button
        if(target.name == "go_to_checkout") {
            event.preventDefault();
            this.updateItemsArray();
            this.initiateCustomCheckout();
        }
    }

    updateItemsArray() {
        //get all items array
        this.itemsArray = [];
        const allProductInputs = document.querySelectorAll(`[data-store="cart-form"] input[type="number"]`);
        for(let itemInput of allProductInputs) {
            const productId = itemInput.getAttribute(`data-item-id`);
            const itemCount = itemInput.value;

            this.itemsArray.push( { productId, itemCount } );
        }
        
    }

    async initiateCustomCheckout() {
        console.log(this.itemsArray);
        const cartId = LS.cart.id;
        const cartDataObj = { items:  this.itemsArray, cartId };
        console.log(cartDataObj);
        
        const req = await fetch(this.checkoutURL, {
            method: "POST",
            body: JSON.stringify(cartDataObj)
        });

        const res = await req.text();
        console.log(res)
    }
}

window.wisn_customCheckout = new wisn_custom_checkout();
})()
