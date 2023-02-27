import { Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Navigation from './components/navigation/Navigation'
import Home from './pages/Home';

import './assets/App.css';


function App() {
  return (
    <div className="App">
     <Navigation/>
     <Routes>
       <Route path='/' element ={<Home/>}/>
     </Routes>
    </div>
  );
}

export default App;
