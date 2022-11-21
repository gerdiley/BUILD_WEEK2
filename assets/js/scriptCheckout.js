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
var buyNow;

// ON LOAD
window.addEventListener("DOMContentLoaded", initCart);

function initCart() {
    userCart = document.getElementById("cart");
    empty = document.getElementById("empty");
    cartTotal = document.getElementById("cartTotal");
    buyNow = document.getElementById("buyNow");

    eventHandlerCart();
}

// Event HANDLER
function eventHandlerCart() {
    if (localStorage.getItem("user")) {
        // user is logged in. show their cart
        userId = Number(localStorage.getItem("userId"));

        getCart(userId);
    }

    buyNow.addEventListener("click", function () {
        emptyCart();
    })
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

                buyNow.setAttribute("disabled", "");
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
                            <div class="card border-white">
                                <div class="row">

                                    <div class="col-md-4" style="max-width: 150px">
                                        <img src="${product.image}" class="img-fluid rounded-start p-2" alt="Product"">
                                    </div>

                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">${product.title}</h5>

                                            <p class="card-text">${product.price}&euro;</p>

                                            <div class="d-flex justify-content-between align-items-end">
                                                <div class="card-text">
                                                    Q.ty:
                                                    <input class="quantity" type="number" value="1" min="1">
                                                </div>
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
async function emptyCart() {

    let cartId = localStorage.getItem("cartId");

    var emptyCartArray = {
        idUser: userId,
        articles: []
    };

    let response = await fetch('http://localhost:3000/cart/' + cartId,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(emptyCartArray)
        }
    )

    let myModal = new bootstrap.Modal(document.getElementById('myModal'), {});

    myModal.show();
}