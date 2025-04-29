import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events/:id" element={<EventDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
