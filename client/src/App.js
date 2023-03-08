import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Navigation from './components/Navigation/Navigation'
import Catalog from './components/Catalog/Catalog'

import './assets/App.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';


function App() {
  return (
    <div className="App">
     <Navigation/>
     <main id="main-content">
     <Routes>
        <Route path='/' element ={<Catalog/>}/> 
        <Route path='/login' element = {<Login/>}/>
        <Route path='/register' element = {<Register/>}/>
     </Routes>
     </main>
    </div>
  );
}

export default App;
