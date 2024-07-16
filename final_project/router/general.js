const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body;
    if (!username || !password)
        return res
            .status(400)
            .json({ message: "Username and password are required" });

    if (isValid(username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({
        username,
        password,
    });
    return res
        .status(201)
        .json({ message: `User ${username} registered successfully` });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    //Write your code here
    new Promise((res, rej) => {
        setTimeout(() => {
            if (books) {
                res(books);
            } else {
                rej("No books found");
            }
        }, 2500);
    }).then((books) => {
        return res
            .status(200)
            .json(books)
    }).catch((err) => {
        return res
            .status(404)
            .json({ message: err });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    //Write your code here
    const { isbn } = req.params;
    //ID will be used as ISBN
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    //Write your code here
    const { author } = req.params;
    const foundBook = Object.values(books).find(
        (book) => book.author === author
    );
    if (foundBook) {
        return res.status(200).json(foundBook);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    //Write your code here
    const { title } = req.params;
    const foundBook = Object.values(books).find((book) => book.title === title);
    if (foundBook) {
        return res.status(200).json(foundBook);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    //Write your code here
    const { isbn } = req.params;
    const book = books[isbn];
    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res
            .status(404)
            .json({ message: "Book not found or no reviews" });
    }
});

module.exports.general = public_users;
