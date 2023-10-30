import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Signup from './Components/Signup';
import About from './Components/About';
import Contact from './Components/Contact';
import Departments from './Components/Departments';
import Dashboard from './Components/Dashboard';
import Projects from './Components/Projects'
import Alerts from './Components/Alerts'
import { useState } from 'react';

function App() {

  const [alert, setAlert] = useState(null);
  const showAlert = (msg, type) => {
    setAlert({
      message: msg,
      type: type
    })
    setTimeout(() => {
      setAlert(null)
    }, 2000)
  }

  return (
      <>
        <Navbar showAlert={showAlert}/>
        <Alerts alert={alert} />
        <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route exact path='login' element={<Login showAlert={showAlert}/>} />
          <Route exact path='signup' element={<Signup showAlert={showAlert}/>} />
          <Route exact path='about' element={<About/>} />
          <Route exact path='contact' element={<Contact/>} />
          <Route exact path='departments' element={<Departments />} />
          <Route exact path='projects' element={<Projects/>} />
          <Route exact path='dashboard/*' element={<Dashboard/>} />
        </Routes>
      </>
  );
}

export default App;
