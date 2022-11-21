// VARIABLES
var cartList = [];
var userCart;
var userId;
var currentCart = false;
var content = [];
var empty;
var url = window.location.href;
var total = 0;
var cartTotal;
var checkout;

// ON LOAD
window.addEventListener("DOMContentLoaded", initCart);

function initCart() {
    userCart = document.getElementById('cart');
    empty = document.getElementById("empty");
    cartTotal = document.getElementById("cartTotal");
    checkout = document.getElementById("btnCheckout");

    eventHandlerCart();
}

// Event HANDLER
function eventHandlerCart() {
    if (localStorage.getItem("user")) {
        // user is logged in. show their cart
        userId = Number(localStorage.getItem("userId"));

        getCart(userId);

        checkout.addEventListener("click", function() {
            location.href = "checkout.html";
        })
    }

}

// GET USER'S CART
async function getCart(userId) {
    let response = await fetch("http://localhost:3000/cart")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            cartList = data;

            cartList.forEach(cart => {
                if (cart.idUser == userId) {
                    content = cart.articles;
                    currentCart = true;
                }
            });

            if (currentCart) {
                content.forEach(product => {
                    getProduct(product);
                });
            }

            // If cart is empty
            if (content == "") {
                empty.innerHTML = "Your cart is empty.";
            }
        });
};

async function getProduct(productId) {
    let response = await fetch("http://localhost:3000/articles/" + productId)
        .then((response) => {
            return response.json();
        })
        .then((product) => {

            total += product.price;

            userCart.innerHTML += `
                        <li class="list-group-item p-0">
                            <div class="card border-white" style="max-width: 540px;">
                                <div class="row">

                                    <div class="col-md-4 pe-0 d-flex align-items-center">
                                        <img src="${product.image}" class="img-fluid rounded-start p-2" alt="...">
                                    </div>

                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">${product.title}</h5>

                                            <p class="card-text">${product.price}&euro;</p>

                                            <div class="d-flex justify-content-between align-items-end">
                                                <p class="card-text">Q.ty: 1</p>
                                                <button type="button" class="btn btn-danger" onclick="deleteProd(${productId})">X</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        `
        });

        cartTotal.innerHTML = `Total: ${total} &euro;`;
};

// DELETE PRODUCT
async function deleteProd(id) {

    let cartId = localStorage.getItem("cartId");
    var f = 0;
    var newArray = [];

    console.log(content);

    for (let i = 0; i < content.length; i++) {
        if (content[i] == id) {
            i;
        }
        else {
            newArray[f] = content[i];
            f++;
        }
    }

    console.log(content);

    content = newArray;

    console.log(content);

    var newProduct = {
        idUser: userId,
        articles: content
    };

    let response = await fetch('http://localhost:3000/cart/' + cartId,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(newProduct)
        }
    )

    window.location.reload();
}