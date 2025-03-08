import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import AddFormcomp from './components/AddFormcomp';
import BooksList from './components/BooksList';
import UpdateBook from './components/UpdateBook';

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:'/addbook',
    element:<AddFormcomp/>
  },
  {
    path:'/bookslist',
    element:<BooksList/>
  },
  {
    path:'/update/:_id',
    element:<UpdateBook/>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
