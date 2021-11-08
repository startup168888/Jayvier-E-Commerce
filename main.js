let carts = document.querySelectorAll('.add-cart');
let products =[
    {
        name:'Attack on Titan: Figurine',
        tag:'AnimeFig1',
        price:35,
        inCart:0,
    },
    {
        name:'Rezero: Figurine',
        tag:'AnimeFig2',
        price:25,
        inCart:0,
    },
    {
        name:'Hero Academia: Figurine',
        tag:'AnimeFig3',
        price:30,
        inCart:0,
    }
]

for (let i = 0; i< carts.length; i++){
    carts[i].addEventListener('click', () =>{
        cartNumbers(products[i]);
        totalCost(products[i]);
    })
}

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');

    if(productNumbers){
        document.querySelector('.cart span').textContent= productNumbers;
    }
}

function cartNumbers(product) {
    
    let productNumbers = localStorage.getItem('cartNumbers');
    
    productNumbers= parseInt(productNumbers);
    if( productNumbers ){
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    }
    else{
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1;
    }

    setItems(product);
}

function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    if(cartItems != null) { 
        if(cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        }
    }    
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product) {
    let cartCost = localStorage.getItem('totalCost');
    
    console.log('My cart cost is', cartCost);

    if(cartCost != null){
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost + product.price);
    }
    else{
        localStorage.setItem("totalCost", product.price);
    }
}

function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector(".products");
    let cartCost = localStorage.getItem('totalCost');
    if( cartItems && productContainer ) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
                <div class="cart-row">
                    <div class="product">
                        <ion-icon name="close-circle-outline"></ion-icon>
                        <img src="${item.tag}.jfif">
                        <span>${item.name}</span>
                    </div>
                    <div class="price">$${item.price}</div>
                    <div class="quantity">
                        <div class='decrease'>
                            <ion-icon name="remove-circle-outline"></ion-icon>
                        </div>
                        <span>${item.inCart}</span>
                        <div class='increase'>
                            <ion-icon name="add-circle-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="total">
                        $${item.inCart * item.price},00
                    </div>
                </div>
            `
        });

        productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">
                    Basket Total
                </h4>
                <h4 class="basketTotal">
                    $${cartCost},00
                </h4>
            </div>
            
        `
    }

    //deleteButtons();
    //manageQuantity();
}

function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product ion-icon');
    let productName;
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let cartCost = localStorage.getItem('totalCost');
    


    for(let i=0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            console.log(deleteButtons[i].parentElement.textContent)
            productName = deleteButtons[i].parentElement.textContent.trim().toLowerCase().replace(/ /g, '');
            // console.log(productName);
            // console.log(cartItems[productName].name + " " + cartItems[productName].inCart)
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart );

            localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName];
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            displayCart();
            onLoadCartNumbers();
        });
    }
}

function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let cartItems = localStorage.getItem('productsInCart');
    let currentQuantity = 0;
    let currentProduct = "";
    cartItems = JSON.parse(cartItems);
    console.log(cartItems);

    for(let i=0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
            console.log(currentProduct);

            if( cartItems[currentProduct].inCart > 1 ) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers( cartItems[currentProduct], "decrease" );
                totalCost( cartItems[currentProduct], "decrease" );
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }
        });
    }

    for(let i=0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', () => {
            console.log("Increase button");
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);

            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLowerCase().replace(/ /g, '').trim();
            console.log(currentProduct);

            
                cartItems[currentProduct].inCart += 1;
                cartNumbers( cartItems[currentProduct]);
                totalCost( cartItems[currentProduct]);
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            
        })
    }
}


/* Displaying Orders while checking out */
function displayOrder() {
    let cartItems = localStorage.getItem('productsInCart')
    document.getElementById("orders").value = "Orders: " + cartItems
}
/* Displaying Total while checking out */
function displayTotal() {
    let total = localStorage.getItem('totalCost')
    document.getElementById("total").value = "Total Amount: $"  + total
}


onLoadCartNumbers();
displayCart();

displayOrder();
displayTotal()


/* Clear cart button function */
function clearLocalStorage(){
    alert("Are you sure you want to clear your cart?")
    if(localStorage.getItem("totalCost") != null){
        localStorage.clear();
        window.location.reload();
    }
}
/*Chatbot open and close*/
const dialogflow = document.querySelector('.dialogflow');
const chatBtn = document.querySelector('.chat-btn');
function opened(){  
    dialogflow.classList.add('active');
}
function hide(){  
    chatBtn.addEventListener('click', ()=>{
        dialogflow.classList.remove('active');
        console.log('Clicked');
        location.reload();
    })
}

/* Checkout Button */
function thanks() {
    alert('Please Check Your Email for Information' + "\n" + 'Please Proceed to Payment Page');
    if(localStorage.getItem("totalCost") != null){
        localStorage.clear();
        window.location.reload();
    }
}

/*Checkout Info*/
const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}



/* Paypal 
paypal
  .Buttons({
    createOrder: function () {
      return fetch("/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              id: 1,
              quantity: 2,
            },
            { id: 2, quantity: 3 },
          ],
        }),
      })
        .then(res => {
          if (res.ok) return res.json()
          return res.json().then(json => Promise.reject(json))
        })
        .then(({ id }) => {
          return id
        })
        .catch(e => {
          console.error(e.error)
        })
    },
    onApprove: function (data, actions) {
      return actions.order.capture()
    },
  })
  .render("#paypal")
*/

/* Cross Button Function (remove item row) */
/*
function remove(product){
    let removeBtn = document.getElementsByName('close-circle-outline');
    let cartItems = localStorage.getItem("productsInCart");
    let productNumbers = localStorage.getItem("cartNumbers");
    let cartCost = localStorage.getItem("totalCost")
    cartItems = JSON.parse(cartItems);

    Object.values(cartItems).filter(item=>{
        console.log(cartItems.tag)
    })
    
    //console.log(cartItems)
    for ( let i=0; i < removeBtn.length; i++ ){
        let button = removeBtn[i];
        button.addEventListener('click',()=>{
            Object.values(cartItems).map(item=>{
                if(cartItems[product.tag] == item.tag){
                    localStorage.remove(item)
                }
            })
        });
    }
    
}
remove();

function manageQuantity() {
    let decreaseBtns = document.querySelectorAll('.decrease');
    let increaseBtns = document.querySelectorAll('.increase');
    let cartItems = localStorage.getItem('productsInCart');
    let currentQuantity = 0;
    let currentProduct = "";
    cartItems = JSON.parse(cartItems);
    console.log(cartItems);

    for(let i=0; i < decreaseBtns.length; i++){
        decreaseBtns[i.addEventListener('click', ()=>{
            currentQuantity = decreaseBtns[i].parentElement.querySelector('span').textContent()
            console.log(currentQuantity)
            currentProduct = decreaseBtns[i].parentElement.previousElementSibling.previousElementSibling
            console.log(currentProduct)

            if (cartItems[currentProduct].inCart>1){
                cartItems[currentProduct].inCart -= 1;
                cartNumbers( cartItems[currentProduct], "decrease");
                totalCost (cartItems[currentProduct], "decrease");
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }
        })]
    }

    for(let i=0; i < increaseBtns.length; i++){
        increaseBtns[i.addEventListener('click', ()=>{
            currentQuantity = increaseBtns[i].parentElement.querySelector('span').textContent()
            console.log(currentQuantity)
            currentProduct = increaseBtns[i].parentElement.previousElementSibling.previousElementSibling
            console.log(currentProduct)

            if (cartItems[currentProduct].inCart>1){
                cartItems[currentProduct].inCart += 1;
                cartNumbers( cartItems[currentProduct]);
                totalCost (cartItems[currentProduct]);
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }
        })]
    }
}

*/
/*
function removeItems(product){
    let removeBtn = document.getElementsByName('close-circle-outline');
    let cartItems = localStorage.getItem("productsInCart");
    let cartNum = localStorage.getItem("cartNumbers");
    cartItems = JSON.parse(cartItems);

    for ( let i=0; i < removeBtn.length; i++ ){
        let button = removeBtn[i];
        button.addEventListener('click',()=>{
            button.parentElement.parentElement.remove();      
            console.log('Clicked')     
        });
    }
}
removeItems();

Object.values(cartItems).map(item =>{
    item.inCart=0
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));

    cartNumbers();
    onLoadCartNumbers();

    localStorage.removeItem("productsInCart");
});
*/

