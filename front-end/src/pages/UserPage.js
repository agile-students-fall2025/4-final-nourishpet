import React from 'react';
import { Link } from 'react-router-dom';

function UserPage(){
    return(
        <div>
            <div>User Info</div>
            <button>
                <Link to="/">Home Page</Link>
            </button>
        </div>
    )
}

export default UserPage;