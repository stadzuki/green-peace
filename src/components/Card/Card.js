import React from 'react';

import Category from '../Category';

import styles from './Card.module.scss';

function Card() {

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
        <div className={`${styles.innerCard} ${styles.cardContainer}`}>
            <div className={styles.selectList}>
                <select name="city-list" >
                    <option value="DEFAULT" selected disabled>Где вы находитесь?</option>
                    <option value="Moscow">Москва</option>
                    <option value="Kazan">Казань</option>
                    <option value="Piter">Санкт-Петербург</option>
                    <option value="Razan">Рязань</option>
                    <option value="Omsk">Омск</option>
                    <option value="Samara">Самара</option>
                </select>
                <div className={styles.dropIcon}>
                    <img src="/img/drop-down.png" width="15" height="15" />
                </div>
            </div>
            <div className={styles.cardCategories}>
                <p className={styles.categoriesTitle}>Что хотите сдать?</p>
                <ul className={styles.categoriesList}>
                    {categories.map((category, idx) => {
                        return <Category key={idx} type={category.type} img={category.img} onCategoryClick={() => clickCategoryHandler(category.type)}/>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Card