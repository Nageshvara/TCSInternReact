import React, { useEffect, useState } from "react";
import { Form, Row, Col, Modal, Spinner,Button } from "react-bootstrap";
import axios from "axios";
import Autherrorimg from "../imgs/auth_error.svg"
import { useNavigate } from "react-router-dom";

const Formcomp = () => {
  const loggedInUser = localStorage.getItem("uname");
  const navigate =useNavigate();

  const [formData, setFormData] = useState({
    BookName: "",
    Author: loggedInUser,
    AuthorEmail: "",
    Publisher: "",
    Description: "",
    Price: "",
  });

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAuthModal(true);
    }
  }, []);

  const handleAuthClose = () => {
    setShowAuthModal(false);
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    setValidated(true);
    setLoading(true); 

    try {
      const response = await axios.post("https://tcsinternreact.onrender.com/addbook", formData,{
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log("Form Submitted Successfully:", response.data);
      setShowSuccessModal(true);
      setFormData({
        BookName: "",
        Author: "",
        AuthorEmail: "",
        Publisher: "",
        Description: "",
        Price: "",
      });
      setValidated(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      let errorMsg = "Failed to submit book details. Please try again.";

      if (error.response && error.response.data && error.response.data.error) {
        errorMsg = error.response.data.error;
      }

      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form id="bookForm" className="needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Label>Book Name</Form.Label>
            <Form.Control
              type="text"
              name="BookName"
              minLength={5}
              required
              value={formData.BookName}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">Book Name must be at least 5 characters.</Form.Control.Feedback>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              name="Author"
              minLength={5}
              required
              value={formData.Author}
              readOnly
            />
            <Form.Control.Feedback type="invalid">Author Name must be at least 5 characters.</Form.Control.Feedback>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>Author Email</Form.Label>
            <Form.Control
              type="email"
              name="AuthorEmail"
              required
              value={formData.AuthorEmail}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">Enter a valid email address.</Form.Control.Feedback>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>Publisher</Form.Label>
            <Form.Control
              type="text"
              name="Publisher"
              minLength={5}
              required
              value={formData.Publisher}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">Publisher Name must be at least 5 characters.</Form.Control.Feedback>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="Description"
              minLength={20}
              required
              value={formData.Description}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">Description must be at least 20 characters.</Form.Control.Feedback>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Label>Price (Rs)</Form.Label>
            <Form.Control
              type="number"
              name="Price"
              required
              value={formData.Price}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">Enter a valid price.</Form.Control.Feedback>
          </Col>
        </Row>

        <Button type="submit" className="btn-dark w-full" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
        </Button>
      </Form>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Book details submitted successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>OK</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowErrorModal(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showAuthModal} onHide={handleAuthClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Authentication Required</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={Autherrorimg}
            alt="Login Required"
            style={{ width: "100%", maxWidth: "300px", marginBottom: "10px" ,height:"100px"}}
          />
          <p>You must be logged in to access this page.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAuthClose}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Formcomp;
