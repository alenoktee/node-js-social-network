import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios";
import LoginForm from './Components/LoginForm';

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);


  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api");
    setArray(response.data.fruits);
  }

  useEffect(() => {
    fetchAPI();
  }, [])

  return (
    <div>
      <LoginForm />
    </div>
  )
}

export default App
