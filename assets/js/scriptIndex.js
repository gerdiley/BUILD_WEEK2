// inizializziamo variabili

var cards;
var list = [];
var url = window.location.href;

window.addEventListener("DOMContentLoaded", init);

function init() {
    cards = document.getElementById("cards");
    printData();
}

function printData() {
    fetch("http://localhost:3000/articles")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            list = data;
            if (list.length > 0) {
                cards.innerHTML = '';
                
                // Show only the first 6 products on the list
                let list2 = list.slice(1, 7);
                list = list2;

                list.map(function (element) {
                    cards.innerHTML += `
                    <div class="card" onclick="location.href='detail.html?id=${element.id}'">
                        <img src="${element.image}" class="card-img-top px-3 pt-3">
                        <div class="card-body text-center">
                            <h5 class="card-title">${element.title}</h5>
                            <p class="fs-5">${element.price}&euro;</p>
                        </div>
                    </div>`
                });
            }
        });
}




