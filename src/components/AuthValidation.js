import React, { useEffect, useState } from "react";
import { Form, Row, Col, Modal, Spinner,Button } from "react-bootstrap";
import axios from "axios";
import Autherrorimg from "../imgs/auth_error.svg"
import { useNavigate } from "react-router-dom";

function AuthValidation() {

    const navigate =useNavigate();
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

    return (
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
  )
}

export default AuthValidation
