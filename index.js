document.addEventListener("DOMContentLoaded",() =>{
  fetchCurrentUser()
  fetchBooks()
});

function fetchBooks(){
    fetch('http://localhost:3000/books')
    .then(response=>response.json())
    .then(books=>{
      books.forEach(book=>{
        displayBook(book)
      })
    })
}
function fetchCurrentUser(){
  fetch('http://localhost:3000/users/8')
  .then(response=>response.json())
  .then(user=>{
    currentUser = user
  })
}


function showPanel(){
  return document.querySelector('#show-panel')
}
function displayBook(book){
  let bookList = document.querySelector('#list-panel')
  let listItem = document.createElement('li')
  listItem.id = book.id
  listItem.addEventListener("click",(e)=>{
    showPanel().innerHTML = ""
    fetchBook(e)
  })
  listItem.innerText = book.title
  bookList.appendChild(listItem)
}

function fetchBook(e){
  let bookId = e.currentTarget.id
  fetch(`http://localhost:3000/books/${bookId}`)
  .then(res=>res.json())
  .then(book=>{
    displayThumbnail(book)
  })
}


function displayThumbnail(book){
  showPanel().innerHTML = ""
  let title = document.createElement('h3')
  title.innerText = book.title
  showPanel().appendChild(title)

  let img = document.createElement('img')
  img.src = book.img_url
  showPanel().appendChild(img)

  let description = document.createElement('p')
  description.innerText = book.description
  showPanel().appendChild(description)

  let likeButton = document.createElement('button')
  likeButton.id = book.id
  likeButton.addEventListener("click",(e)=>{
  logLikeClick(e)
})
  likeButton.innerText = `Like ${book.title}`
  showPanel().appendChild(likeButton)

  let likesList = document.createElement('ul')
  showPanel().appendChild(likesList)

  let likes = document.createElement('h3')
  likes.innerText = "Likes:"
  likesList.appendChild(likes)


  book.users.forEach(user=>{
    let userLikes = document.createElement('h4')
    userLikes.innerText = user.username
    likesList.appendChild(userLikes)
  })

}


function logLikeClick(e){
  let bookId = e.currentTarget.id
  BookLikes(bookId)
}

function BookLikes(bookId){
  fetch(`http://localhost:3000/books/${bookId}`)
  .then(res=>res.json())
  .then(book=>{
    let id = book.id
    let likes = book.users
    likes[likes.length] = currentUser
    patchBook(id,likes)
  })
}


function patchBook(id,likes){
  fetch(`http://localhost:3000/books/${id}`,{
    method: "PATCH",
    headers:{
      "Content-Type" : "application/json",
      "Accept" : "application/json"
    },
    body: JSON.stringify({
      users: likes
    })
  })
  .then(res=>res.json())
  .then(book=>{
    displayThumbnail(book)
  })
}
