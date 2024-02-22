const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let axios = require("axios")

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
        if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
        return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
    });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let promise = new Promise((resolve, reject)=>{
        resolve(res.send(books))
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let bookChoice = req.params.isbn
  let promise = new Promise((resolve, reject)=>{
    resolve(res.send(books[bookChoice]))
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let authorChoice = req.params.author
  let ans = []
  for(let i in books){
    if(books[i].author === authorChoice){
        ans.push(books[i])
    }
  }
  let promise = new Promise((resolve, reject)=>{
    resolve(res.send(JSON.stringify(ans)))
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let ans = []
  let titleName = req.params.title
  for(let i in books){
    if(books[i].title === titleName){
        ans.push(books[i])
    }
  }
  let promise = new Promise((resolve, reject)=>{
    res.send(JSON.stringify(ans))
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let ans = []
  let isbnNum = req.params.isbn
  for(let i in books){
    if(i === isbnNum){
        ans.push(books[i].reviews)
    }
  }
  res.status(300).send(JSON.stringify(ans));
});

module.exports.general = public_users;