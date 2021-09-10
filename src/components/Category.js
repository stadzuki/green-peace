import React from 'react';

function Category({type, img, onCategoryClick}) {
    return (
        <li className={`category-item ${type}`}
            onClick={onCategoryClick}
        >
            <img src={img}
            width="25"
            height="25"
            alt={`${type} category`} 
        /></li>
    )
}

export default Category