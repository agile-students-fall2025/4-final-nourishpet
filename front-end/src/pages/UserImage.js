import React from 'react';

function UserImage(){
    return( 
        <div className='user-portrait'>
            <div className="portrait-placeholder">
                <img
                    src='../logo.svg'
                    alt='UserImage'
                    className="user-photo"
                />
            </div>
        </div>
    );
}

export default UserImage;