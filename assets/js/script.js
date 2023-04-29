var searchBtn = $('#search'); 
var searchBar = $('#searchBar');
var booksList = $("#books");
// var bookColumns = $("#bookColumns"); 
var search = searchBar.textContent; 

//Hides Intro on Search // added 
searchBtn.click(function() {
  $("#intro").hide(); 
})

searchBtn.on("click",function(){
  // booksList[0].textContent = ""; 
  var search = $('#searchBar').val();
  if (search == ''){
      alert("Please enter something in the search bar")
  }
  else {
     getBooks(search); 
     
  }
});

var table = document.getElementById("table");

function getBooks(books){
  var encodedSearch = encodeURIComponent(books); 
  var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + encodedSearch + "&maxResults=10&key=AIzaSyB8K95K3Skp2q0fAnkEfjlwQpcQRrLLv5Y";  
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function(data){ 
         console.log(data);
         for (var i=0; i < data.items.length; i++){
          var tr = document.createElement("tr");
          // bookColumns[0].appendChild(tr);
          var title = document.createElement("td");
          title.textContent = data.items[i].volumeInfo.title;
          var author = document.createElement("td");
          author.textContent = data.items[i].volumeInfo.authors;
          var info = document.createElement("td");
          info.textContent = data.items[i].volumeInfo.info;
          // booksList[0].appendChild(td);
          // th.innerText = data.items[i].volumeInfo.title;
          tr.appendChild(title);
          tr.appendChild(author);
          tr.appendChild(info);
          table.appendChild(tr);
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

