import React from 'react'
import {Container,Button,Card} from "react-bootstrap"
import Formcomp from './Formcomp'
import { Link } from 'react-router-dom'

function AddFormcomp() {
  return (
    <Container className='mt-5 flex flex-col justify-center items-center'>
      <Card className='shadow p-4 w-full max-w-3xl'>
        <h2 className='text-center text-gray-800'>Book Details Form</h2>
        <Formcomp/>
      </Card>
      <div className="text-center mt-4">
        <Link to='/bookslist'>
          <Button className="btn-dark">
            Go to List Page
          </Button>
        </Link>
      </div>
    </Container>
  )
}

export default AddFormcomp
