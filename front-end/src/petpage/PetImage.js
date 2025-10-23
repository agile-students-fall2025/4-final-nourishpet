import React from 'react';
import './PetPage.css'

function PetImage({petName}){
    return( 
        <div className='pet-image'>
            <p>{petName}</p>
            <img
                src='https://picsum.photos/200/300'
                alt='Pet'
                className="pet-photo"
            />
        </div>
    );
}

export default PetImage;