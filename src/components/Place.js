import React from 'react';

function Place({name, adress, onPlaceClick}) {
    return (
        <li className="place" onClick={onPlaceClick}>
            <div className="placeTitle">{name}</div>
            <div className="placeDescription">{adress}</div>
        </li>
    )
}

export default Place