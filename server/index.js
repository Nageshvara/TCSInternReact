require("dotenv").config
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const Author = require("./models/AuthorBook");

const app = express();

app.use(cors());
app.use(bodyParser.json());


mongoose.connect("mongodb+srv://nagaesvara:Nagesh%40bkdb25@authorsandbooks.owlaw.mongodb.net/Booksystem")
.then(()=>{
    console.log("MongoDbConnected")
}).catch((err)=>console.log(err))

app.post("/addbook", async (req, res) => {
    const { Author: authorName, AuthorEmail, BookName, Publisher, Description, Price } = req.body;
  
    if (!authorName || !AuthorEmail || !BookName || !Publisher || !Description || !Price) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const existingAuthor = await Author.findById(authorName);
  
      if (existingAuthor) {
        const bookExists = existingAuthor.books.some(book => book.title === BookName);
        if (bookExists) {
          return res.status(400).json({ error: "This book already exists for this author!" });
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
      res.status(500).json({ error: error.message });
    }
  });

  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });