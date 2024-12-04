// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Contact from './components/Contact';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Logout from './components/auth/Logout';
import PrivateRoute from './components/auth/PrivateRoute';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Profile from './components/Profile';
import GoogleLoginPage from './components/auth/GoogleLoginPage';


const App = () => {
  return (
      <Router>
          <Navbar /> {/* Add the Navbar here !! */}
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} /> {/* Fallback route for 404 Page */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/google-login" element={<GoogleLoginPage />} />
              <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                /> 
                <Route 
                    path="/tasks" 
                    element={
                        <PrivateRoute>
                            <Tasks />
                        </PrivateRoute>
                    } 
                /> 
                <Route 
                    path="/profile" 
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } 
                /> 
              <Route 
                    path="/logout" 
                    element={
                        <PrivateRoute>
                            <Logout />
                        </PrivateRoute>
                    } 
                /> {/* Make Logout a private route */}
          </Routes>
      </Router>
  );
};

export default App;
