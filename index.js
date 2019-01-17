document.addEventListener("DOMContentLoaded", function() {
	console.log('connected')
	booksPromise = fetch('http://localhost:3000/books').then(res => res.json());
	usersPromise = fetch(`http://localhost:3000/users`).then(res => res.json());
	Promise.all([booksPromise, usersPromise]).then(both => {
		const books = both[0];
		const users = both[1];
		const me = users.find(user => user.id === 1);
		books.forEach(book => {
			renderBook(book, me);
		})
	})
});


function renderBook(book, me){
	const showBooks = document.querySelector('#list')

	const bookTitle = document.createElement('li')
	bookTitle.innerText = book.title
	showBooks.appendChild(bookTitle)

	bookTitle.addEventListener('click', function(){
		bookClicked(book, me)
	})
}


function bookClicked(book, me){
	console.log('I was clicked')
	const bookInfo = document.querySelector('#show-panel')
	while (bookInfo.firstChild) {
    	bookInfo.removeChild(bookInfo.firstChild);
	}

	const bookName = document.createElement('h2')
	bookName.innerText = book.title
	bookInfo.appendChild(bookName)

	const image = document.createElement('img')
	image.src = book.img_url
	bookInfo.appendChild(image)

	const description = document.createElement('p')
	description.innerText = book.description
	bookInfo.appendChild(description)

	const likeBtn = document.createElement('button')
	likeBtn.classList.add('like-btn')
	likeBtn.innerText = 'Read Book'
	bookInfo.appendChild(likeBtn)

	likeBtn.addEventListener('click', function(){
		patchLikes(book, me);
	})
}

function patchLikes(book, user){
	const data = {
		'users': book.users
	}
	data.users.push(user);
	// debugger
	fetch(`http://localhost:3000/books/${book.id}`, {
		method: 'PATCH',
		headers: {
			"Content-Type": "application/json",
  			"Accept": "application/json"
		},
		body: JSON.stringify(data)
	}).then(res => res.json())
	.then(book => {
		const usersPanel = document.querySelector('#show-panel')
		book.users.forEach(user =>{
			let shownUser = document.createElement('li')
			shownUser.innerText = user.username
			usersPanel.appendChild(shownUser)
		})
		
	})
}











