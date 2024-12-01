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

const App = () => {
  return (
      <Router>
          <Navbar /> {/* Add the Navbar here !! */}
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} /> {/* Fallback route for 404 Page */}
              <Route path="/contact" element={<Contact />} />
          </Routes>
      </Router>
  );
};

export default App;
