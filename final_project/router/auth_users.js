const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  const foundUser = users.find(user => user.username === username)
  if (foundUser) {
    return true
  }
  
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(user => user.username === username && user.password === password)

  if (user) {
    return true;
  }

  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  

  if (authenticatedUser(username, password)) {
    // Generate JWT for logged in user
    const token = jwt.sign({ id: username }, 'verySecretString', { expiresIn: 60 * 60 });
    // Save the token and username in session
    req.session.authorization = {
      token, username
    };

    return res.status(200).json({ message: `Login successful`, cookie: token })
  } else { 
    return res.status(400).json({message: "Invalid credentials"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn, review } = req.body;
  let book;

  if (!isbn) return res.status(401).json({ message: "ISBN is required" });

  if (req.session) {
    const { username, token } = req.session.authorization;
    
    book = books[isbn];

    const foundUser = Object.values(book.reviews).find(item => item.username === username)
    if (foundUser) {
      foundUser.review = review;
    } else {
      // Auto increment the key for the next review by finding highest key in review object.
      const nextReviewKey = Math.max(0, ...Object.keys(book.reviews).map(Number)) + 1;
      // Keep existing review and spread new review into book
      book.reviews = {
          ...book.reviews,
          [nextReviewKey] : {username, review}
      };
    }
    return res.status(200).json(book);
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
