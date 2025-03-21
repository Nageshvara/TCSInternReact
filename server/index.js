require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Author = require("./models/AuthorBook");
const User = require("./models/User");
const errorMessages = require("./errorMessages");

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://nagaesvara:Nagesh%40bkdb25@authorsandbooks.owlaw.mongodb.net/Booksystem")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => console.log(err));

app.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ error: errorMessages.missingFields });
        }
        const existinguser = await User.findOne({ username });
        if (existinguser) {
            return res.status(400).json({ error: errorMessages.usernameExists });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        return res.status(200).json({ message: "User Registered successfully" });
    } catch (error) {
        res.status(500).json({ error: errorMessages.registrationFailed });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: errorMessages.userNotFound });
        }
        const isSame = await bcrypt.compare(password, user.password);
        if (!isSame) {
            return res.status(400).json({ error: errorMessages.invalidPassword });
        }
        const token = jwt.sign({ username: user.username }, "a9b8c7d6e5f4a3b2c1d0e9f8g7h6i5j4k3l2m1n0o9p8q7r6s5t4u3", { expiresIn: "1h" });
        res.json({ message: "Successful Login", token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: errorMessages.loginFailed });
    }
});

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ error: errorMessages.accessDenied });
    }
    try {
        const verified = jwt.verify(token, "a9b8c7d6e5f4a3b2c1d0e9f8g7h6i5j4k3l2m1n0o9p8q7r6s5t4u3");
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: errorMessages.invalidToken });
    }
};

app.get("/mybooks", authMiddleware, async (req, res) => {
    try {
        const uname = req.user.username;
        const author = await Author.findOne({ "authorDetails.AuthorName": uname });
        if (!author) {
            return res.status(404).json({ error: errorMessages.noBooksFound });
        }
        res.json(author.books);
    } catch (error) {
        res.status(500).json({ error: errorMessages.fetchBooksError });
    }
});

app.post("/addbook", authMiddleware, async (req, res) => {
    const { Author: authorName, AuthorEmail, BookName, Publisher, Description, Price } = req.body;

    if (!authorName || !AuthorEmail || !BookName || !Publisher || !Description || !Price) {
        return res.status(400).json({ error: errorMessages.allFieldsRequired });
    }

    try {
        const existingAuthor = await Author.findById(authorName);

        if (existingAuthor) {
            const bookExists = existingAuthor.books.some(book => book.title === BookName);
            if (bookExists) {
                return res.status(400).json({ error: errorMessages.bookExists });
            }

            existingAuthor.books.push({
                title: BookName,
                publisher: Publisher,
                description: Description,
                price: Price,
            });

            await existingAuthor.save();
            res.status(200).json({ message: "Book added successfully!" });
        } else {
            const newAuthor = new Author({
                _id: authorName,
                authorDetails: { AuthorName: authorName, AuthorEmail },
                books: [
                    {
                        title: BookName,
                        publisher: Publisher,
                        description: Description,
                        price: Price,
                    },
                ],
            });

            await newAuthor.save();
            res.status(201).json({ message: "Author and book added successfully!" });
        }
    } catch (error) {
        res.status(500).json({ error: errorMessages.fetchBookFailed });
    }
});

app.get('/getbooks', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 8;
      const skip = (page - 1) * limit;
  
      const authors = await Author.find();
      const books = authors.flatMap((author) =>
        author.books.map((book) => ({
          _id: book._id,
          bookName: book.title,
          author: author.authorDetails.AuthorName,
          email: author.authorDetails.AuthorEmail,
          publisher: book.publisher,
          description: book.description,
          price: book.price,
        }))
      );
  
      const paginatedBooks = books.slice(skip, skip + limit);
      res.status(200).json({ books: paginatedBooks, total: books.length });
    } catch (error) {
      res.status(500).json({ error: errorMessages.fetchBookFailed });
    }
  });

  
app.get('/getbook/:_id', async (req, res) => {
    try {
        const bookId = req.params._id;
        const authors = await Author.find();
        let bookfound = null;
        for (const auth of authors) {
            const bk = auth.books.find((b) => b._id.toString() === bookId);
            if (bk) {
                bookfound = {
                    _id: bookId,
                    bookName: bk.title,
                    author: auth.authorDetails.AuthorName,
                    email: auth.authorDetails.AuthorEmail,
                    publisher: bk.publisher,
                    description: bk.description,
                    price: bk.price,
                };
                break;
            }
        }
        if (bookfound) {
            res.status(200).json(bookfound);
        } else {
            res.status(404).json({ error: errorMessages.cannotUpdateBook });
        }
    } catch (error) {
        res.status(500).json({ error: errorMessages.fetchBookFailed });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
