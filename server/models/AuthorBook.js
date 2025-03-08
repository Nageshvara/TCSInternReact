const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  title: { type: String, required: true, minlength: 5 },
  publisher: { type: String, required: true, minlength: 5 },
  description: { type: String, required: true, minlength: 20 },
  price: { type: Number, required: true },
});

const authorSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  authorDetails: {
    AuthorName: { type: String, required: true },
    AuthorEmail: { type: String, required: true, match: /.+\@.+\..+/ },
  },
  books: [bookSchema],
});

const Author = mongoose.model("AuthorDetailsandbooks", authorSchema);
module.exports = Author;
