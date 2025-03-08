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

  app.get("/getbooks", async (req, res) => {
    try {
      const authors = await Author.find();
      const books = authors.flatMap((author) =>
        author.books.map((book) => ({
          _id:book._id,
          bookName: book.title,
          author: author.authorDetails.AuthorName,
          email: author.authorDetails.AuthorEmail,
          publisher: book.publisher,
          description: book.description,
          price: book.price,
        }))
      );
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch books" });
    }
  });

  app.get('/getbook/:_id',async (req,res)=>{
    try{
    const bookId = req.params._id;
    const authors = await Author.find();
    let bookfound=null;
    for(const auth of authors){
        const bk = auth.books.find((b)=>b._id.toString()===bookId);
        if(bk){
            bookfound={
                _id:bookId,
                bookName:bk.title,
                author:auth.authorDetails.AuthorName,
                email: auth.authorDetails.AuthorEmail,
                publisher: bk.publisher,
                description: bk.description,
                price: bk.price,
            }
            break;
        }
    }
    if(bookfound){
        res.status(200).json(bookfound);
    }
    else{
        res.status(404).json({error:"Cant update the requested book."})
    }
    }
    catch (error){
        res.status(500).json({ error: "Failed to fetch book details" });
    }
  })

  app.put("/updatebook/:id", async (req, res) => {
    try {
      const bookId = req.params.id;
      const { bookName, email, publisher, description, price } = req.body;
  
      const authors = await Author.find();
      for (const author of authors) {
        const bookIndex = author.books.findIndex((b) =>b._id.toString() === bookId);
        if (bookIndex !== -1) {
          author.books[bookIndex].title = bookName;
          author.books[bookIndex].publisher = publisher;
          author.books[bookIndex].description = description;
          author.books[bookIndex].price = price;
          await author.save();
          return res.status(200).json({ message: "Book updated successfully" });
        }
      }
  
      res.status(404).json({ error: "Book not found" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update book" });
    }
  });  

  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });