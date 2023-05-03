
let favBooksList = document.getElementById("favoriteBooks");

function favoriteBooks() {
    let data = localStorage.getItem("favoriteBooks");
    let favBooks = JSON.parse(data);

    favBooks.favoriteBooks.forEach(function (book, i) {
        createBookCard(book.thumbnailLink, book.title, book.author, book.year, book.description)

    });
}

function createBookCard(thumbnailLink, title, author, year, description) {
    let cuteBookCard = document.getElementById("favoriteBooks")
    cuteBookCard.className = "media m-5"
    cuteBookCard.innerHTML=`
    <figure class="media-left"> 
      <p class="image is-64x64">
        <img src="${thumbnailLink}">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>${title}</strong> <small>${author}</small> <small><i>${year}</i></small>
          <br>
        </p>
        <p style="height:3em;overflow:hidden;">
        ${description}
        </p>
      </div>
    </div>
    <i class="fa-solid fa-2xl fa-book-medical"></i>`;
    return cuteBookCard
  }
// function clearHighScores(){
//     if (localStorage.getItem("object") !== null) {
//         localStorage.clear();

//     table.innerHTML= ""; 
//     }
// }
// clearScore.onclick = clearHighScores;
console.log(favoriteBooks);
window.onload=favoriteBooks();