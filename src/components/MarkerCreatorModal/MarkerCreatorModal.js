import React from 'react';
import Category from '../Category';

import styles from './MarkerCreatorModal.module.scss'

function MarkerCreatorModal() {
    const categories = [
        {type: 'paper', img: '/img/category/paper.png'},
        {type: 'glass', img: '/img/category/glass.png'},
        {type: 'bottle', img: '/img/category/bottle.png'},
        {type: 'tin', img: '/img/category/tin.png'},
        {type: 'clothes', img: '/img/category/clothes.png'},
        {type: 'gadget', img: '/img/category/gadget.png'},
        {type: 'radioactive', img: '/img/category/radioactive.png'},
        {type: 'battery', img: '/img/category/battery.png'},
        {type: 'lamp', img: '/img/category/lamp.png'},
        {type: 'technique', img: '/img/category/technique.png'},
        {type: 'package', img: '/img/category/package.png'},
        {type: 'beer', img: '/img/category/beer.png'},
        {type: 'tires', img: '/img/category/tires.png'},
    ]

    const clickCategoryHandler = (t) => {
        console.log(t);
    }

    return (
        <div>
            <div className={`${styles.modal}`}>
                <form>
                    <p>
                        <span>Название места</span>
                        <input type="text" placeholder="Укажите название места" />
                    </p>
                </form>
                {/* select */}
                <p className={styles.categoriesTitle}>Укажите категорию(и)</p>
                <ul className={styles.categoriesList}>
                    {categories.map((category, idx) => {
                        return <Category 
                                    key={idx} 
                                    type={category.type} 
                                    img={category.img} 
                                    onCategoryClick={() => clickCategoryHandler(category.type)}
                                />
                    })}
                </ul>
            </div>
        </div>
    )
}

export default MarkerCreatorModal;