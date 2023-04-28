var searchBtn = $('#search'); 
var searchBar = $('#searchBar');
var booksList = $("#books");
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
  var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + encodedSearch + "&maxResults=10&key=AIzaSyB8K95K3Skp2q0fAnkEfjlwQpcQRrLLv5Y"; 
  console.log(apiUrl)
  fetch(apiUrl)
    .then((response) => {
      return response.json()
      })
    .then(function(data){ 
      console.log(data);
      for (var i=0; i < data.items.length; i++){
      var tr = document.createElement("tr");
      bookColumns[0].appendChild(tr);
      var th = document.createElement("th");
      booksList[0].appendChild(th);
      th.innerText = data.items[i].volumeInfo.title;
      renderWiki(data.items[i].volumeInfo.title);
      }})
    .catch(function (error) {
      console.log(error)
    });
};

function renderWiki(pages) {
  var wikiSearch = "https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=search&formatversion=2&srsearch=" + pages;

  fetch(wikiSearch)
      .then(function(response){
          return response.json();})
      .then(function(responseData) {
          console.log(responseData);
      })
      .catch(function(error){console.log(error);});
}

