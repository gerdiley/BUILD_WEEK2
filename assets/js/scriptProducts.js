// inizializziamo variabili

var cards;
var list = [];
var list2 = [];
var url = window.location.href;
var cat = Number(url.slice(url.indexOf('=') + 1, url.length));
var radio, radio1, radio2, radio3, radio4;
var cartArticles = [];

window.addEventListener("DOMContentLoaded", initProducts);

function initProducts() {
    // initCart();
    cards = document.getElementById("productCards");
    radio = document.getElementById("radioAll");
    radio1 = document.getElementById("radioGuitars");
    radio2 = document.getElementById("radioPianos");
    radio3 = document.getElementById("radioViolins");
    radio4 = document.getElementById("radioDrums");
    switchCat();
    eventHandlerProducts();
    printData();
}

function switchCat() {
    switch (cat) {
        case 1: radio1.checked = true;
            break;
        case 2: radio2.checked = true;
            break;
        case 3: radio3.checked = true;
            break;
        case 4: radio4.checked = true;
            break;
        default: radio.checked = true;
            break;
    }
}

function eventHandlerProducts() {

    radio.addEventListener('change', () => {
        location.href = "products.html?cat=0";
    });
    radio1.addEventListener('change', () => {
        location.href = "products.html?cat=1";
    });
    radio2.addEventListener('change', () => {
        location.href = "products.html?cat=2"
    });
    radio3.addEventListener('change', () => {
        location.href = "products.html?cat=3"
    })
    radio4.addEventListener('change', () => {
        location.href = "products.html?cat=4"
    })
}

function printData() {
    fetch("http://localhost:3000/articles")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            list = data;
            list.forEach((element) => {
                if (element.idCat == cat || cat == 0) {
                    cards.innerHTML += `
                    <div class="card border border-white align-content-between">
                        <div class="text-center"><img src="${element.image}" class="card-img-top px-3 pt-3" onclick="location.href='detail.html?id=${element.id}'"></div>
                        <div class="card-body text-center d-flex flex-column justify-content-between cardText pb-0">
                            <h5 class="card-title mb-0" onclick="location.href='detail.html?id=${element.id}'">${element.title}</h5>
                            <div class="d-flex justify-content-between align-items-center">
                                <p class="fs-4 text-start">${element.price}&euro;</p>
                                <button type="button" class="add btn btn-warning ms-2 mb-2 fs-5" onclick="addProd(${element.id})"><i class="bi bi-cart-plus"></i></button>
                            </div>
                        </div>
                    </div>`
                }
            });
        });
}

async function addProd(product) {
    var uID = Number(localStorage.getItem('userId'));
    var cID = Number(localStorage.getItem('cartId'));

    let response = await fetch("http://localhost:3000/cart/")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            list2 = data;
            list2.forEach((element) => {
                if (element.id == cID) {
                    cartArticles = element.articles;
                    console.log(element.articles);
                    let cart = {
                        idUser: uID,
                        articles: []
                    }
                    cartArticles.push(product);
                    cart.articles = cartArticles;
                    console.log('nuovo carrello');
                    console.log(cart.articles);

                    updateCart(cart, cID);

                }
            });
        })
        .then(() => {
            reload();
        });
};

async function updateCart(cart, cID) {
    let response = await fetch("http://localhost:3000/cart/" + cID, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(cart),
    });
};