let searchBtn = $('#search'); 
let searchBar = $('#searchBar');
let booksList = $("#books");
let bookColumns = $("#bookColumns"); 
let search = searchBar.textContent; 
let searchForm = $("#searchForm")
let author = "";



//Removed function from click event to allow search with 'submit'/enter key OR clicking button
searchBtn.on("click", function(){
   doSearch();
});
searchForm.on("submit",function(event){
  doSearch();
})


//Function takes user input, checks if there is input, executes getBooks function w/API call with user input 
function doSearch() {
  booksList[0].innerHTML = ""; 
  let search = searchBar.val();
  if (search == ''){
      alert("Please enter something in the search bar")
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
        alert('Error: ' + response.statusText);
      }
    })
    .then(function (data) {
      console.log(data);
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
            $("#intro").hide();
          })
        } else {
          //createElement on article which uses the format of bulma for a tweet layout, just modified slightly 
          //All the places that we want pulled information has their variable called within the article that will be generated 
          let cuteBookCard = createBookCard(thumbnail_url, title, author, year, description)
          booksList[0].appendChild(cuteBookCard);
        }
    }})}

  function createBookCard(thumbnailLink, title, author, year, description) {
    let cuteBookCard = document.createElement("article")
    cuteBookCard.className = "media"
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
    </div>`;
    return cuteBookCard
  }




