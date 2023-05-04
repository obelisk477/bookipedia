let searchBtn = $('#search'); 
let searchBar = $('#searchBar');
let booksList = $("#books");
let bookColumns = $("#bookColumns"); 
let search = searchBar.textContent; 
let searchForm = $("#searchForm")
let author = "";
let favoritesBtn = $("#favorite")
let favoriteSection = $("#favoriteSection");

let modal = document.getElementById("modal")
let closeModalBtn = document.getElementById("close-modal")


let footerclass = document.querySelector(".footer");  


//Removed function from click event to allow search with 'submit'/enter key OR clicking button
searchBtn.on("click", function(){
   doSearch();
   $("#intro").hide()
   $("#favoriteSection").hide()
   $("#books").show()
   footerclass.classList.remove('footer'); 
   footerclass.classList.add('footerPosition')
    

});
searchForm.on("submit",function(){
  doSearch();
  $("#intro").hide()
  $("#favoriteSection").hide()
   $("#books").show()
  footerclass.classList.remove('footer'); 
  footerclass.classList.add('footerPosition'); 
   
})

// Favorite Tab 
favoritesBtn.on("click", function(){
  $("#intro").hide()
  $("#books").hide()
  $("#favoriteSection").show()
  checkFeetsies(); 
  loadFavorites();

});
function checkFeetsies(){
  if ($('section #stickyFeet').length < 2){
    footerclass.classList.remove('footer'); 
    footerclass.classList.add('footerPosition2');
}else{
  footerclass.classList.remove('footerPosition2');
  footerclass.classList.add('footerPosition'); 
}}

function loadFavorites (){
  
  favoriteSection[0].innerHTML = "";
  let data = localStorage.getItem("favoriteBooks");
    let favBooks = JSON.parse(data);

    favBooks.favoriteBooks.forEach(function (book, i) {     

      let favAuthorLink = ""
      let favAuthorTag = ""
      if (book.author) {
        let encodedAuthor = encodeURIComponent(book.author)
        fetch(`https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&list=search&formatversion=2&srsearch=${encodedAuthor}`)
        .then((response) => {
          return response.json()
        }).then((data) => {
          let pageHandle = data.query.search[0].title.replace(' ','_')
          favAuthorLink = `https://en.wikipedia.org/wiki/${pageHandle}`
          favAuthorTag = `<a href="${favAuthorLink}">${data.query.search[0].title}</a>`
  
          let favorite = createFavorite(book.thumbnailLink, book.title, favAuthorTag, book.year, book.description)
        favoriteSection[0].appendChild(favorite);
        })
      } else {
        let favorite = createFavorite(book.thumbnailLink, book.title, book.author, book.year, book.description)
        favoriteSection[0].appendChild(favorite);
      }
    });
    checkFeetsies(); 
}

function createFavorite(thumbnailLink, title, author, year, description) {
  let favBookCard = document.createElement("article"); 
  favBookCard.id = "stickyFeet"
  favBookCard.className = "media m-5"
  favBookCard.innerHTML=`
  <figure class="media-left"> 
    <p class="image is-66x66">
      <img src="${thumbnailLink}">
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <p>
        <strong>${title}</strong> <small>${author}</small> <small><i>${year}</i></small>
        <br>
      </p>
      <p class="description collapsed">
        ${description}
      </p>
      <a href="#" class="showmore">More...</a>
      <a href="#" class="showless" style="display:none">Less</a>
    </div>
  </div>
  <i class="fa-solid fa-xmark"></i>`;
  let removeFav = favBookCard.querySelector('.fa-solid');
  removeFav.addEventListener('click', removeFavBook);
  let desc = favBookCard.querySelector(".description");
  let moreButton = favBookCard.querySelector(".showmore");
  let lessButton = favBookCard.querySelector(".showless");
  moreButton.addEventListener('click', expandDescriptionFunc(desc,moreButton,lessButton));
  lessButton.addEventListener('click', collapseDescriptionFunc(desc,moreButton,lessButton));
  checkFeetsies(); 
  return favBookCard
}

function removeFavBook(event) {
  let removeIcon = event.target
  removeIcon.classList.add('fa-beat-fade')
  setTimeout(() => {
    removeIcon.classList.remove('fa-beat-fade')
  }, 850)

  let favoriteTitle = event.target.parentElement.children[1].querySelectorAll('strong')[0].textContent;
  let favoriteAuthor = event.target.parentElement.children[1].querySelector('a').innerText;
  let favoriteYear = event.target.parentElement.children[1].querySelector('i').innerText;

  var removeBooks = JSON.parse(localStorage.getItem("favoriteBooks"));

  removeBooks.favoriteBooks.forEach(function (book, i) {
    if (removeBooks.favoriteBooks[i].title === favoriteTitle && removeBooks.favoriteBooks[i].author === favoriteAuthor && removeBooks.favoriteBooks[i].year === favoriteYear) {
        removeBooks.favoriteBooks.splice(i, 1);
    }
});
  removeBooks = JSON.stringify(removeBooks);
  localStorage.setItem("favoriteBooks", removeBooks);
  loadFavorites();
  checkFeetsies(); 
}

//Function takes user input, checks if there is input, executes getBooks function w/API call with user input 
function doSearch() {
  booksList[0].innerHTML = ""; 
  let search = searchBar.val();
  if (search == ''){
      modal.getElementsByTagName('p')[0].innerText = "Please enter a book to search."
      modal.showModal()
  }
  else {
     getBooks(search); 
     
  }
}


//Helper function to grab only certain parts of the data from booksAPI
//.indexOf('.') method checks what index of the array of booksAPI data a '.' appears and if not returns value of -1
//As long as value greater than -1, uses substring method to isolate the data we want from a specific array of the API data to another array of data inside of that array
function fetchFromObject(obj, wantedInfo){
  if(typeof obj === 'undefined') return false;
  let index = wantedInfo.indexOf('.')
  if(index > -1){
      return fetchFromObject(obj[wantedInfo.substring(0, index)], wantedInfo.substring(index+1));
  }
  return obj[wantedInfo];
}

//Dont forget to change the API key! '&maxResults' to change amount of cuteBookCards

function getBooks(books){
    let encodedSearch = encodeURIComponent(books); 
    let apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + encodedSearch + "&maxResults=5&key=AIzaSyBryYvVLyuoI5Rb37cQo37EGgud-ZOAaKE"; 
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json()
      } else {
        response.json().then((data) => {
          modal.getElementsByTagName('p')[0].innerText = "Error: " + data.error.message
          modal.showModal()
          return
        })
      }
    })
    .then(function (data) {
      for (let i=0; i < data.items.length; i++){
        //Grabs the thumbnail by using fetchFromObject function 
        //Checks if there is no URL listed, to have some kind of blank or placeholder image? 
        let thumbnail_url = fetchFromObject(data.items[i], "volumeInfo.imageLinks.thumbnail")
        if (!thumbnail_url) {
          thumbnail_url = "about:blank";
        }
        let title = data.items[i].volumeInfo.title;
        
        //Grabs the author information
        //Author variable created because the format of 'authors' in the API is an array with potentially multiple others and to check for an author 
        //As long as there is something in the 0 index of the authors array itll be set to the author 
        
        let authors = fetchFromObject(data.items[i], "volumeInfo.authors");
        author = "";
        if (authors) {
          author = authors[0];
        }
        //Grabs the full published date, which is in year-month-day format 
        let publishDate = fetchFromObject(data.items[i], "volumeInfo.publishedDate");
        //Grabs only the year portion of the published date 
        let year = (new Date(publishDate)).getFullYear();
        
        //Grabs description info, returns blank if no description found 
        //Could put some kind of placeholder here as well for if no description?
        let description = fetchFromObject(data.items[i], "volumeInfo.description");
        if (!description) {
          description = "";
        }
    
        let authorLink = ""
        let authorTag = ""
        if (author) {
          let encodedAuthor = encodeURIComponent(author)
          fetch(`https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&list=search&formatversion=2&srsearch=${encodedAuthor}`)
          .then((response) => {
            return response.json()
          }).then((data) => {
            let pageHandle = data.query.search[0].title.replace(' ','_')
            authorLink = `https://en.wikipedia.org/wiki/${pageHandle}`
            authorTag = `<a href="${authorLink}">${data.query.search[0].title}</a>`
    
            let cuteBookCard = createBookCard(thumbnail_url, title, authorTag, year, description)
            booksList[0].appendChild(cuteBookCard);
          })
        } else {
          //createElement on article which uses the format of bulma for a tweet layout, just modified slightly 
          //All the places that we want pulled information has their variable called within the article that will be generated 
          let cuteBookCard = createBookCard(thumbnail_url, title, author, year, description)
          booksList[0].appendChild(cuteBookCard);
        }
        
      }
      window.setTimeout(function() {
        $(".description").each(function() {
          let element = this;
          if (element.scrollHeight <= element.clientHeight) {
            element.classList.add("noexpand")
          }
        });
      }, 500);

    })}

  function createBookCard(thumbnailLink, title, author, year, description) {
    let cuteBookCard = document.createElement("article")
    cuteBookCard.className = "media m-5"
    cuteBookCard.innerHTML=`
    <figure class="media-left"> 
      <p class="image is-66x66">
        <img src="${thumbnailLink}">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>${title}</strong> <small>${author}</small> <small><i>${year}</i></small>
          <br>
        </p>
        <p class="description collapsed">
        ${description}
        </p>
        <a href="#" class="showmore">More...</a>
        <a href="#" class="showless" style="display:none">Less</a>
      </div>
    </div>
    <i class="fa-solid fa-2xl fa-book-medical"></i>`;
    let bookIcon = cuteBookCard.querySelector('.fa-solid');
    bookIcon.addEventListener('click', handleFavoriteClick );
    let desc = cuteBookCard.querySelector(".description");
    let moreButton = cuteBookCard.querySelector(".showmore");
    let lessButton = cuteBookCard.querySelector(".showless");
    moreButton.addEventListener('click', expandDescriptionFunc(desc,moreButton,lessButton));
    lessButton.addEventListener('click', collapseDescriptionFunc(desc,moreButton,lessButton));
    return cuteBookCard;
  }

function expandDescriptionFunc(desc,more,less) {
  return function(event) {
    desc.classList.remove("collapsed")
    more.setAttribute("style", "display:none");
    less.setAttribute("style", "");
  }
}

function collapseDescriptionFunc(desc,more,less) {
  return function(event) {
    desc.classList.add("collapsed")
    less.setAttribute("style", "display:none");
    more.setAttribute("style", "");
  }
}

function handleFavoriteClick(event) {
  let bookIcon = event.target
  bookIcon.classList.add('fa-beat-fade')
  setTimeout(() => {
    bookIcon.classList.remove('fa-beat-fade')
  }, 850)

  let favoriteTitle = event.target.parentElement.children[1].querySelectorAll('strong')[0].textContent;
  let favoriteAuthor = event.target.parentElement.children[1].querySelector('a').innerText;
  let favoriteYear = event.target.parentElement.children[1].querySelector('i').innerText;
  let favoriteDescription = event.target.parentElement.children[1].querySelectorAll('p')[1].innerText;
  let favoriteThumbnail = event.target.parentElement.children[0].querySelector('img').src;

  let storeFavs = (...books) => {
    let data = { "title":books[0], "author":books[1], "year":books[2], "description":books[3], "thumbnailLink":books[4]}
    var favoriteBooks = []
    var books = {}

    if (localStorage.getItem("favoriteBooks") === null){   
        books.favoriteBooks = favoriteBooks
    } else {
        try {
            books = JSON.parse(localStorage.getItem("favoriteBooks"));
        } catch {
            books.favoriteBooks = favoriteBooks
        }            
    }

    let foundDuplicate = false; 
      books.favoriteBooks.forEach(function (book, i) {
          if(book.title === favoriteTitle && book.author === favoriteAuthor && book.year === favoriteYear){
            foundDuplicate = true; 
          }
    });
    if(!foundDuplicate) {
      books.favoriteBooks.push(data);
    }
    localStorage.setItem("favoriteBooks", JSON.stringify(books));
    checkFeetsies(); 
}
checkFeetsies(); 
storeFavs(favoriteTitle, favoriteAuthor, favoriteYear, favoriteDescription, favoriteThumbnail);
}

closeModalBtn.addEventListener('click', () => {
  modal.close()
})
