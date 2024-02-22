const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60000 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let num = req.params.isbn
  let reviewedBooks = books[num]
  if(reviewedBooks){
    let review = req.body.review
    if(review){
        let user = req.body.username
        for(let i in reviewedBooks["reviews"]){
            if(reviewedBooks["reviews"] === user){
                reviewedBooks[i] = review
                res.status(200).send(`${user} revised their review of: ${reviewedBooks.title}`)
            }
        }
        reviewedBooks["reviews"] += {"username": user, "review": review}
        res.status(200).send(`${user} created a new review for: ${reviewedBooks.title}`)
    }
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let bookIsbn = req.params.isbn
    let user = req.body.username
    let bookReviewsToDelete = books[bookIsbn]
    let ans = []
    for(let i in bookReviewsToDelete.reviews){
        ans.push(i)
        for(let x in i){
            ans.push(bookReviewsToDelete["reviews"][x])
            if(bookReviewsToDelete["reviews"][x]["username"] === user){
                delete bookReviewsToDelete[i]
                res.status(300).send(JSON.stringify(`Removed review of ${books[bookIsbn].title} by ${user}`))
            }
        }
    }
    res.send(JSON.stringify(ans))
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;