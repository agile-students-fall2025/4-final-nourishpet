import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserPage from './pages/UserPage.js';
import HomePage from './pages/HomePage.js';
import EditUserInfo from './pages/EditUserInfo.js'
import PetPage from './petpage/PetPage.js';
import FeedPage from './pages/FeedPage.js';


import Archive from './archives/Archive.js';
import HistRecord from './archives/HistRecord.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/editUserInfo" element={<EditUserInfo />} />
          <Route path="/petpage" element={<PetPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
