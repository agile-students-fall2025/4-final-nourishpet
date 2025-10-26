import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

function HomePage(){
    return(
        <div>
            <div>Home Page</div>
            <button>
                <Link to="/userpage">User Page</Link>
            </button>
            <button>
                <Link to="/petpage">Pet Page</Link>
            </button>
            <button>
                <Link to="/archives">Archives</Link>
            </button>
            
            <Footer />
        </div>
        
    )
}

export default HomePage;