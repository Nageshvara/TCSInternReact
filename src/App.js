import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Button } from 'react-bootstrap';
import {Link} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Link to='addbook'>
          <Button>Add new Book</Button>
      </Link>
    </div>
  );
}

export default App;
