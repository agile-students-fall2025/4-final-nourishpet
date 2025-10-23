import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserPage from './pages/UserPage.js';
import HomePage from './pages/HomePage.js';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/userpage" element={<UserPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
