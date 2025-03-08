import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link,useNavigate } from 'react-router-dom';
import { Table,Button,Spinner,Form } from 'react-bootstrap'

function ShowListOfBooks() {
  
  const [books, setBooks] = useState([]);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [loading,setLoading] = useState(false);
  const [searchTnput,setSearchInput] = useState("");
  const navigate = useNavigate();
  
  useEffect(()=>{
    fetchBooks();
  },[]);

  const fetchBooks =async ()=>{
    try {
        const response = await axios.get("https://tcsinternreact.onrender.com/getbooks")
        setBooks(response.data)
        setSearchedBooks(response.data)
    } catch (error) {
        console.error(error);
    } finally{
        setLoading(false);
    }
  }

  const handleSearch = (e) =>{
    const searchtxt = e.target.value.toLowerCase();
    setSearchInput(searchtxt)
    setSearchedBooks(
        books.filter((book)=>book.bookName.toLowerCase().includes(searchtxt))
    )
  }
  const toggleDescrip = (bookId) =>{
    document.getElementById(`desc_${bookId}`).classList.toggle("d-none");
  }

  return (
    <div className='container mt-4'>
        <h1 className='text-center'>List of Books</h1>
        <div className='flex flex-row justify-between'>
            <Form.Control
                type="text"
                placeholder="Search by Book Name"
                className="mb-3 max-w-sm"
                value={searchTnput}
                onChange={handleSearch}
            />
            <Link to='addbook'>
                <Button className='btn-dark'>Add new Book</Button>
            </Link>
        </div>
        {loading?(
            <div className='text-center'>
                <Spinner animation='border' variant='primary'/>
            </div>
        ): searchedBooks.length === 0 ? (
            <p className="text-danger text-center">No books found.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
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
                          variant="primary"
                          size="sm"
                          onClick={() => toggleDescrip(book._id)}
                        >
                          View
                        </Button>{" "}
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => navigate(`/update/${book._id}`)}
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                    <tr id={`desc_${book._id}`} className="d-none">
                      <td colSpan="5" className="text-muted">
                        {book.description}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </Table>)}
    </div>
  )
}

export default ShowListOfBooks
