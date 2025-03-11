import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Spinner, Form } from "react-bootstrap";

function MyBooksList() {
  const [books, setBooks] = useState([]);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();   
  
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/mybooks", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setBooks(response.data);
      setSearchedBooks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const searchTxt = e.target.value.toLowerCase();
    setSearchInput(searchTxt);
    setSearchedBooks(
      books.filter((book) => book.title.toLowerCase().includes(searchTxt))
    );
  };

  const toggleDescrip = (bookId) => {
    document.getElementById(`desc_${bookId}`).classList.toggle("d-none");
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">List of Books</h1>
      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Search by Book Name"
          className="w-50"
          value={searchInput}
          onChange={handleSearch}
        />
        <Link to="/bookslist">
            <Button variant="dark">Show all Author's Books</Button>
        </Link>
        <Link to="/addbook">
          <Button variant="dark">Add New Book</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="dark" />
        </div>
      ) : searchedBooks.length === 0 ? (
        <p className="text-danger text-center">No books found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Book Name</th>
              <th>Price (Rs)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchedBooks.map((book) => (
              <React.Fragment key={book._id}>
                <tr>
                  <td>{book.title}</td>
                  <td>{book.price}</td>
                  <td>
                    <Button variant="primary" size="sm" onClick={() => toggleDescrip(book._id)}>
                      View
                    </Button>{" "}
                    <Button variant="warning" size="sm" onClick={() => navigate(`/update/${book._id}`)}>
                      Update
                    </Button>
                  </td>
                </tr>
                <tr id={`desc_${book._id}`} className="d-none">
                  <td colSpan="3" className="text-muted">{book.description}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default MyBooksList;
