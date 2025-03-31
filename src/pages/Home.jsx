import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import FeaturedEvents from '../components/FeaturedEvents';
import '../assets/styles/main.css';

function Home() {
  return (
    <div className="home">
      <Hero />
      <SearchBar />
      <FeaturedEvents />
    </div>
  );
}

export default Home;
