// VARIABLES
var firstName;
var surname;
var email;
var password;
var btnUp;
var username;
var list = [];
var exist = false;
var errName;
var errSurname;
var errEmail;
var errUser;
var errPass;
var outcome = false;
var newId;


//REGEX

var regexName = /^[\s\w-]{1,10}$/;
var regexEmail = /^[\w-._]+@([\w-]+.)+[\w-]{2,5}$/;
var regexPassword = /^[A-Za-z0-9!#$%&@*?]{8,100}$/;
var regexUser = /^[\d\w-._]{3,16}$/;


// ON LOAD
window.addEventListener("DOMContentLoaded", init);

function init() {
    btnUp = document.getElementById('btnUp');
    firstName = document.getElementById('name');
    surname = document.getElementById('surname');
    email = document.getElementById('email');
    password = document.getElementById('password');
    username = document.getElementById('username');
    errName = document.getElementById('errName');
    errSurname = document.getElementById('errSurname');
    errEmail = document.getElementById('errEmail');
    errUser = document.getElementById('errUser');
    errPass = document.getElementById('errPass');

    eventHandler();
}

// Event HANDLER
function eventHandler() {
    btnUp.addEventListener('click', function () {
        // RICHIAMO VALIDATION
        validation();
    });
}

// FUNCTION VALIDATION
function validation() {


    if (!regexName.test(firstName.value)) {
        errName.innerHTML = 'Insert your correct name';
    } else {
        errName.innerHTML = '';
    };

    if (!regexName.test(surname.value)) {
        errSurname.innerHTML = 'Insert your correct name';

    } else {
        errSurname.innerHTML = '';
    };

    if (!regexEmail.test(email.value)) {
        errEmail.innerHTML = 'Insert your correct email address';

    } else {
        errEmail.innerHTML = '';
    };

    if (!regexPassword.test(password.value)) {
        errPass.innerHTML = 'La password deve contenere almeno 8 caratteri, una lettera maiuscola, una minuscola, un numero e un carattere speciale';

    } else {
        errPass.innerHTML = '';
    };
    if (!regexUser.test(username.value)) {
        errUser.innerHTML = 'Insert your correct username';

    } else {
        errUser.innerHTML = '';
    };

    if (regexName.test(firstName.value) && regexName.test(surname.value) && regexEmail.test(email.value) && regexPassword.test(password.value) && regexUser.test(username.value)) {
        // RICHIAMO EXISTENCE
        existence();

    }

}

// FUNCTION EXISTENCE USERNAME AND EMAIL
async function existence() {
    let response = await fetch("http://localhost:3000/users")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            list = data;
            list.forEach(user => {
                if (user.email == email.value) {
                    errEmail.innerHTML = "This email already exists!";
                    exist = true;
                }
                if (user.user == username.value) {
                    errUser.innerHTML = "This username already exists!";
                    exist = true;
                    return;
                }
            });

            exist = false;
        })

    // CREATE USER
    var data = {
        firstname: firstName.value,
        surname: surname.value,
        email: email.value,
        user: username.value,
        password: password.value
    };
    // RICHIAMO ADD DATA
    addData(data);
}

// FUNCTION ADD DATA FOR PUSHING IN THE JSON

async function addData(data) {

    let response = await fetch('http://localhost:3000/users',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(data),
        }
    ).then(() => {
        sessionStorage.setItem("registration", "true");

        getNewId();

        let myModal = new bootstrap.Modal(document.getElementById('myModal'), {});
        myModal.show();
    })
}

async function getNewId() {
    let response = await fetch("http://localhost:3000/users")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            list = data;
            list.forEach(user => {
                if (user.user == username.value) {
                    newId = user.id;
                }
            });
        })

    // CREATE USER CART
    var newCart = {
        idUser: newId,
        articles: []
    };

    pushNewCart(newCart);
}

async function pushNewCart(newCart) {

    let response = await fetch('http://localhost:3000/cart',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(newCart),
        }
    )
}