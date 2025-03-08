import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Spinner, Container, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

function UpdateBook() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get(`https://tcsinternreact.onrender.com/getbook/${_id}`)
      .then((response) => {
        setBook(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book:", error);
        setLoading(false);
      });
  }, [_id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(`https://tcsinternreact.onrender.com/updatebook/${_id}`, book)
      .then(() => {
        setShowSuccessModal(true);
      })
      .catch((error) => {
        setErrorMessage("Error updating book. Please try again.");
        setShowErrorModal(true);
      });
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigate("/"); // Redirect to home page
  };

  const handleCloseError = () => setShowErrorModal(false);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Container>
      <h2 className="text-center mt-3">Update Book</h2>
      <Form onSubmit={handleUpdate}>
        <Form.Group>
          <Form.Label>Book Name</Form.Label>
          <Form.Control
            type="text"
            value={book.bookName}
            onChange={(e) => setBook({ ...book, bookName: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Author</Form.Label>
          <Form.Control type="text" value={book.author} readOnly />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={book.email}
            onChange={(e) => setBook({ ...book, email: e.target.value })}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Publisher</Form.Label>
          <Form.Control
            type="text"
            value={book.publisher}
            onChange={(e) => setBook({ ...book, publisher: e.target.value })}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            value={book.description}
            onChange={(e) => setBook({ ...book, description: e.target.value })}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Price (Rs)</Form.Label>
          <Form.Control
            type="number"
            value={book.price}
            onChange={(e) => setBook({ ...book, price: e.target.value })}
            required
          />
        </Form.Group>

        <Button variant="success" type="submit" className="mt-3">
          Update Book
        </Button>
      </Form>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccess} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Book updated successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseSuccess}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={handleCloseError} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseError}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UpdateBook;
