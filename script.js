let url = "https://striveschool-api.herokuapp.com/books";

const getBooks = async (searchWord = "") => {
    try {
        let response = await fetch(url);
        let books = await response.json();

        if (searchWord !== "") {
            let match = books.filter((book) => {
                return book.title.toLowerCase().includes(searchWord)
            })
            console.log(match)
            displayBooks(match)
        } else {
            displayBooks(books);
        }

    } catch (err) {
        console.log(err);
    }
};

let rowNode = document.querySelector(".row");

const displayBooks = (books) => {
    rowNode.innerHTML = '';
    setTimeout(function () {
        const cards = books
            .map(({ img, title, price }) => {
                return `<div class="col-12 col-sm-6 col-md-4 col-lg-3">
    <div class="card my-3 rounded-0">
        <img src="${img}" class="card-img-top rounded-0" alt="Book Card">
        <div class="card-body">
            <h5 class="card-title truncate">${title}</h5>
            <h6 class="card-subtitle mt-3 mb-5 text-muted">€${price}</h6>
            <div class="d-flex justify-content-end align-items-center">
                <button onclick="removeBook(event)" class="btn btn-outline-danger mr-2">Skip</button>
                <button onclick="addToCart(event), countCartItems()" class="btn btn-primary">Add to Cart</button>
            </div>
        </div>
    </div>
</div>`;
            })
            .join("");
        rowNode.innerHTML = cards;
    }, 100)

};

const addToCart = (event) => {
    const { target } = event;
    target.innerText = '✓ Added';
    target.className = "btn btn-success"
    let cardBodyNode = target.parentElement.parentElement.parentElement;
    let tableBodyNode = document.querySelector("tbody");

    tableBodyNode.innerHTML += `
      <tr>
          <td>${cardBodyNode.querySelector("h5").innerText}</td>
          <td>${cardBodyNode.querySelector("h6").innerText}</td>
          <td class="text-right"><button onclick="deleteFromCart(event), countCartItems()" class="btn btn-danger">Delete</button></td>
      </tr>`;

};

const removeBook = (event) => {
    const { target } = event;
    let bookColumnNode = target.parentElement.parentElement.parentElement.parentElement;
    bookColumnNode.remove()
}

const searchBooks = (event) => {
    const { target } = event;
    let searchWord = target.value

    if (searchWord.length === 0) {
        getBooks()
    }
    if (searchWord.length >= 3) {
        getBooks(searchWord)
    }

}

const deleteFromCart = (event) => {
    const { target } = event;
    target.parentElement.parentElement.remove()
}


const countCartItems = () => {
    let tableBodyNode = document.querySelector("tbody")
    let items = tableBodyNode.querySelectorAll("tr")
    let numberOfItems = Array.from(items).reduce((item) => {
        return item + 1
    }, 0)
    let spanNode = document.querySelector("span")
    spanNode.innerText = `${numberOfItems}`
}

const emptyCart = () => {
    let tableBodyNode = document.querySelector("tbody")
    let items = tableBodyNode.querySelectorAll("tr")
    items.forEach((item) => {

        item.parentElement.removeChild(item)
    })
    countCartItems();
}

window.onload = async () => {
    await getBooks();
};
