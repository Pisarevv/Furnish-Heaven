import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Navigation from './components/Navigation/Navigation'
import Catalog from './components/Catalog/Catalog'

import './assets/App.css';


function App() {
  return (
    <div className="App">
     <Navigation/>
     <main id="main-content">
     <Routes>
        <Route path='/' element ={<Catalog/>}/> 
     </Routes>
     </main>
    </div>
  );
}

export default App;
