const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Promise to get all books
    let myPromise = new Promise ((resolve, reject) => {
        console.log("resolving myPromise listing all books")
        resolve(books);
    })

    //get all books
    myPromise.then((bookList) => {
        res.send(bookList); 
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Promise to get specific book
    let myPromise = new Promise ((resolve, reject) => {
        console.log("resolving myPromise listing specific book")
        const isbn = req.params.isbn;
        console.log(isbn, books[isbn]);
        resolve(books[isbn]);
    })

    //get specific book
    myPromise.then((bookList) => {
        res.send(bookList);
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Promise to get books by author
    let myPromise = new Promise ((resolve, reject) => {
        console.log("resolving myPromise listing books by author")
        const arrayBooks = Object.values(books);
        const selectedBooks = arrayBooks.filter((book) => {return book.author === req.params.author})
        resolve(selectedBooks);
    })

    //get specific book
    myPromise.then((bookList) => {
        res.send(bookList);
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //get books by title
  const arrayBooks = Object.values(books);
  const selectedBooks = arrayBooks.filter((book) => {return book.title === req.params.title})
  res.send(selectedBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //get reviews of specific book
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
