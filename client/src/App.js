import { Routes, Route, Navigate } from 'react-router-dom';

import Navigation from './components/Navigation/Navigation'
import Catalog from './components/Catalog/Catalog'

import './assets/App.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Footer from './components/Footer/Footer';
import About from './components/About/About';
import Faq from './components/Faq/Faq';
import { AuthContext } from './contexts/AuthContext';
import { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import Logout from './components/Logout/Logout';
import Recycle from './components/Recycle/Recycle';
import UserProductDetails from './components/UserProductDetails/UserProductDetails';
import EditUserProduct from './components/EditUserProduct/EditUserProduct';
import CreateUserProduct from './components/CreateUserProduct/CreateUserProduct';
import AnimatedRoutes from './components/AnimatedRoutes/AnimatedRoutes';


function App() {

  const [auth,setAuth] = useLocalStorage('user',{});

  const userLogin = (userData) => {
    setAuth(userData);
  }

  const userLogout = () => {
    setAuth({})
  }


  return (
    <AuthContext.Provider value = {{user: auth, userLogin, userLogout}}>
      <div className="App">
        <Navigation />
        <main id="main-content">
         <AnimatedRoutes/>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
  
}

export default App;

