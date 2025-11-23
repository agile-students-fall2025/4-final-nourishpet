import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserPage from './pages/UserPage.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import EditUserInfo from './pages/EditUserInfo.js'
import PetPage from './petpage/PetPage.js';
import FeedPage from './pages/FeedPage.js';
import Archive from './archives/Archive.js';
import HistRecord from './archives/HistRecord.js';
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/editUserInfo" element={<EditUserInfo />} />
          <Route path="/petpage" element={<PetPage />} />
          <Route path="/feedpage" element={<FeedPage />} />
          <Route path="/archives" element={<Archive />} />
          <Route path="/archives/histrecord/:id" element={<HistRecord />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
