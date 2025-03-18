import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Spinner, Form, Pagination } from 'react-bootstrap';

function ShowListOfBooks() {
  const [books, setBooks] = useState([]);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem('uname');

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const fetchBooks = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://tcsinternreact.onrender.com/getbooks?page=${page}`);
      const allBooks = response.data.books || [];
      setBooks(allBooks);
      setTotalBooks(response.data.total || allBooks.length);
      setSearchedBooks(allBooks); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const searchtxt = e.target.value.toLowerCase();
    setSearchInput(searchtxt);

    if (searchtxt.trim() === '') {
      setSearchedBooks(books);
      return;
    }

    const filteredBooks = books.filter((book) =>
      book.bookName.toLowerCase().includes(searchtxt)
    );

    setTotalBooks(filteredBooks.length);
    setSearchedBooks(filteredBooks.slice(0, 8));
    setCurrentPage(1);
  };

  const toggleDescrip = (bookId) => {
    document.getElementById(`desc_${bookId}`).classList.toggle('d-none');
  };

  const totalPages = Math.ceil(totalBooks / 8);

  return (
    <div className='container mt-4'>
      <h1 className='text-center'>List of Books</h1>
      <div className='d-flex justify-content-between'>
        <Form.Control
          type='text'
          placeholder='Search by Book Name'
          className='mb-3 max-w-sm'
          value={searchInput}
          onChange={handleSearch}
        />
        <Link to='/addbook'>
          <Button className='btn-dark'>Add New Book</Button>
        </Link>
      </div>
      {loading ? (
        <div className='text-center'>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : searchedBooks.length === 0 ? (
        <p className='text-danger text-center'>No books found.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className='table-dark'>
              <tr>
                <th>Book Name</th>
                <th>Author</th>
                <th>Email</th>
                <th>Price (Rs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchedBooks.map((book) => (
                <React.Fragment key={book._id}>
                  <tr>
                    <td>{book.bookName}</td>
                    <td>{book.author}</td>
                    <td>{book.email}</td>
                    <td>{book.price}</td>
                    <td>
                      <Button
                        variant='primary'
                        size='sm'
                        onClick={() => toggleDescrip(book._id)}
                      >
                        View
                      </Button>{' '}
                      <Button
                        variant='warning'
                        size='sm'
                        onClick={() => navigate(`/update/${book._id}`)}
                        disabled={book.author !== loggedInUser}
                      >
                        Update
                      </Button>
                    </td>
                  </tr>
                  <tr id={`desc_${book._id}`} className='d-none'>
                    <td colSpan='5' className='text-muted'>
                      {book.description}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
          {totalPages > 1 && (
            <Pagination className='justify-content-center'>
              {[...Array(totalPages).keys()].map((number) => (
                <Pagination.Item
                  key={number + 1}
                  active={currentPage === number + 1}
                  onClick={() => setCurrentPage(number + 1)}
                >
                  {number + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}

export default ShowListOfBooks;
