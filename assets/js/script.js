var searchBtn = $('#search'); 
var searchBar = $('#searchBar');
var booksList = $("#books");
var authorName = $("#authorName"); 
var bookColumns = $("#bookColumns"); 
var search = searchBar.textContent; 

searchBtn.on("click",function(){
    booksList[0].textContent = ""; 
    var search = $('#searchBar').val();
    if (search == ''){
        alert("Please enter something in the search bar")
    }
    else {
       getBooks(search); 
       
    }
});


function getBooks(books){
    var encodedSearch = encodeURIComponent(books); 
    var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + encodedSearch + "&maxResults=10&key=AIzaSyBryYvVLyuoI5Rb37cQo37EGgud-ZOAaKE"; 
    
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function(data){ 
           console.log(data);
           for (var i=0; i < data.items.length; i++){
            var tr = document.createElement("tr");
            bookColumns[0].appendChild(tr);
            var th = document.createElement("th");
            booksList[0].appendChild(th);
            th.innerText = data.items[i].volumeInfo.title;
            var td = document.createElement("td");
            authorName[0].appendChild(td);
            td.innerText = data.items[i].volumeInfo.authors;
           } 
        });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to Google Books');
      });
  };
