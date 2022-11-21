// VARIABLES
var password;
var btnIn;
var btnCart = document.getElementById("btnCart");
var navLogout;
var username;
var listLogin = [];
var exist = false;
var errUser;
var errPass;
var currentId;
var idUser;
var cartId;
var saveName;
var nameOfUser = localStorage.getItem("nameOfUser");


// POPOVER
if (nameOfUser) {
    const userIcon = document.getElementById("userIcon");
    userIcon.setAttribute("data-bs-content", `
        <p class="text-center fs-5 mb-2"><b>Hello, <span>${localStorage.getItem("nameOfUser")}</span></b><br></p>
        <div class="list-group list-group-flush">
            <a href="#" class="list-group-item list-group-item-action ps-2 fs-6 text-decoration-none        text-dark">Order history</a>
            <a href="#" class="list-group-item list-group-item-action ps-2 fs-6 text-decoration-none        text-dark">Wishlist</a>
            <a href="#" class="list-group-item list-group-item-action ps-2 fs-6 text-decoration-none        text-dark">Your info</a>
            <a href="#" class="list-group-item list-group-item-action ps-2 fs-6 text-decoration-none        text-dark">Settings</a>
        </div>
        `);
} else {
    userIcon.setAttribute("disabled", "");
    btnCart.setAttribute("disabled", "");
}

// Enable popover
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

// ON LOAD
window.addEventListener("DOMContentLoaded", initLogin);

function initLogin() {
    btnIn = document.getElementById('btnIn');
    navLogout = document.getElementById('navLogout');
    password = document.getElementById('password');
    username = document.getElementById('username');
    errUser = document.getElementById('errUser');
    errPass = document.getElementById('errPass');
    userCart = document.getElementById('cart');
    idUser = localStorage.getItem("userId");

    whenLoggedIn();
    eventHandlerLogin();
}

// Event HANDLER
function eventHandlerLogin() {
    btnIn.addEventListener('click', function () {
        // RICHIAMO VALIDATION
        validation();
    });

    // Logout
    navLogout.addEventListener('click', function () {
        logOut();
    });
}

// FUNCTION VALIDATION
function validation() {
    // RICHIAMO EXISTENCE
    existence();
}

// FUNCTION EXISTENCE USERNAME AND EMAIL
async function existence() {
    let response = await fetch("http://localhost:3000/users")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            listLogin = data;
            errUser.innerHTML = "";

            listLogin.forEach(user => {
                if ((user.email == username.value || user.user == username.value) && user.password == password.value) {
                    exist = true;
                    currentId = user.id;
                    saveName = user.firstname;
                }
            });

            if (exist) {
                errUser.innerHTML = "";
                errUser.innerHTML = "Logged in!";

                exist = false;

                // CREATE LOCALSTORAGE DATA
                localStorage.setItem("user", username.value);
                localStorage.setItem("userId", currentId);
                localStorage.setItem("nameOfUser", saveName);

                getCartLogin();

            } else {
                errUser.innerHTML = "";
                errUser.innerHTML = "Username/email or password don't match.";
            };
        });
}

// GET USER'S CART
async function getCartLogin() {
    let response = await fetch("http://localhost:3000/cart")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            cartList = data;
            idUser = localStorage.getItem("userId");

            cartList.forEach(cart => {
                if (cart.idUser == idUser) {
                    cartId = cart.id;
                    localStorage.setItem("cartId", cartId);
                }
            });
        });

        window.location.reload();
};

// Things that happen whenever one is logged in
function whenLoggedIn() {
    if (idUser) {
        let navLogin = document.getElementById("navLogin");

        navLogin.classList.remove("d-block");
        navLogin.classList.add("d-none");
        navLogout.classList.remove("d-none");
        navLogout.classList.add("d-block");

        document.getElementById("btnName").innerHTML = nameOfUser;

    } else {
        navLogin.classList.remove("d-none");
        navLogin.classList.add("d-block");
        navLogout.classList.remove("d-block");
        navLogout.classList.add("d-none");
    };
};

// LOG OUT
function logOut() {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("cartId");
    localStorage.removeItem("nameOfUser");

    window.location.reload();
};