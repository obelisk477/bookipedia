var searchBtn = $('#search'); 
var searchBar = $('#searchBar');
var booksList = $("#books");
var bookColumns = $("#bookColumns"); 
var search = searchBar.textContent; 
var searchForm = $("#searchForm")



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
  var search = searchBar.val();
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
  var index = wantedInfo.indexOf('.')
  if(index > -1){
      return fetchFromObject(obj[wantedInfo.substring(0, index)], wantedInfo.substring(index+1));
  }
  return obj[wantedInfo];
}

//Dont forget to change the API key! '&maxResults' to change amount of cuteBookCards

function getBooks(books){
    var encodedSearch = encodeURIComponent(books); 
    var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + encodedSearch + "&maxResults=5&key=AIzaSyBryYvVLyuoI5Rb37cQo37EGgud-ZOAaKE"; 
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function(data){ 
           console.log(data);
          for (var i=0; i < data.items.length; i++){
            //Grabs the thumbnail by using fetchFromObject function 
            //Checks if there is no URL listed, to have some kind of blank or placeholder image? 
            var thumbnail_url = fetchFromObject(data.items[i], "volumeInfo.imageLinks.thumbnail")
            if (!thumbnail_url) {
              thumbnail_url = "about:blank";
            }
            var title = data.items[i].volumeInfo.title;
            
            //Grabs the author information
            //Author variable created because the format of 'authors' in the API is an array with potentially multiple others and to check for an author 
            //As long as there is something in the 0 index of the authors array itll be set to the author 
            
            var authors = fetchFromObject(data.items[i], "volumeInfo.authors");
            var author = "";
            if (authors) {
              author = authors[0];
            }
            //Grabs the full published date, which is in year-month-day format 
            var publishDate = fetchFromObject(data.items[i], "volumeInfo.publishedDate");
            //Grabs only the year portion of the published date 
            var year = (new Date(publishDate)).getFullYear();
            
            //Grabs description info, returns blank if no description found 
            //Could put some kind of placeholder here as well for if no description?
            var description = fetchFromObject(data.items[i], "volumeInfo.description");
            if (!description) {
              description = "";
            }

            //createElement on article which uses the format of bulma for a tweet layout, just modified slightly 
            //All the places that we want pulled information has their variable called within the article that will be generated 
            var cuteBookCard = document.createElement("article")
            cuteBookCard.className = "media"
            cuteBookCard.innerHTML=`
            <figure class="media-left"> 
              <p class="image is-64x64">
                <img src="${thumbnail_url}">
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
            booksList[0].appendChild(cuteBookCard);
          }
        });
        //Just error stuff lol 
        $("#intro").hide();
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Google Books');
      });
  };

