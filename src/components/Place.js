import React from 'react';

function Place({name, adress}) {
    return (
        <li className="place">
            <div className="placeTitle">{name}</div>
            <div className="placeDescription">{adress}</div>
        </li>
    )
}

export default Place