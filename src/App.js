import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/Login';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    if (!window.location.pathname.includes("/login")) {
      localStorage.removeItem("uname");
      localStorage.removeItem("token");
    }
  }, []);
  return (
    <div className="App">
      <Login/>
    </div>
  );
}

export default App;
