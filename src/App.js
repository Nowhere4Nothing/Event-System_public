import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Organizer from './pages/Organizer';
import EventDetails from './pages/EventDetails';
import './assets/styles/main.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/organizer" element={<Organizer />} />
        <Route path="/events/:id" element={<EventDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
