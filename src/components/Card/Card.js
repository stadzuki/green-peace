import React from 'react';
import AppContext from '../../context';

import Category from '../Category';
import Place from '../Place';

import styles from './Card.module.scss';

function Card() {
    const [isSelectedCategory, setIsSelectedCategory] = React.useState(false)
    const {target, setTarget} = React.useContext(AppContext)

    const selectedCategory = [];
    let selectedItem;

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

    const clickCategoryHandler = (evt, type) => {
        if(target) {
            console.log(1);
            if(evt.target.tagName === 'IMG') {
                evt.target.parentNode.classList.add('selected');
            } else {
                evt.target.classList.add('selected');
            }
            selectedCategory.push(type)
        } else {
            let eTarget;
            if(evt.target.tagName === 'IMG') {
                eTarget = evt.target.parentNode;
            } else {
                eTarget = evt.target;
            }

            if(!isSelectedCategory) {
                eTarget.classList.add('selected');
                selectedItem = eTarget;
                setIsSelectedCategory(true)
            }

            if(isSelectedCategory) {
                console.log(selectedItem);
                console.log(eTarget);
                if(selectedItem === eTarget) {
                    eTarget.classList.remove('selected');
                } else {
                    selectedItem.classList.remove('selected')
                    eTarget.classList.add('selected')
                    selectedItem = eTarget;
                }
            }
            // if(selectedItem === evt.target) {
            //     setIsSelectedCategory((prev) => !prev)
            //     evt.target.classList.toggle('selected')
            //     return 1;
            // } else if(!isSelectedCategory){
            //     if(evt.target.tagName === 'IMG') {
            //         evt.target.parentNode.classList.add('selected');
            //     } else {
            //         evt.target.classList.add('selected');
            //     }
            //     selectedItem = evt.target;
            // } else {
            //     if(evt.target.tagName === 'IMG') {
            //         evt.target.parentNode.classList.remove('selected');
            //     } else {
            //         evt.target.classList.remove('selected');
            //     }
            //     selectedItem = undefined;
            // }

            // Описать логику получения данных о категории в опеределенном выбранном городе!
        }

    }
    //Описать логику вставки добавления метки на карту target/setTargets
    return (
        <div className={`${styles.innerCard} ${styles.cardContainer} ${target ? styles.scroll : ''}`}>
            {/* создать свой компоненты выподающего списка */}
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
                <p className={styles.categoriesTitle}>
                    {!target ? 'Что хотите сдать?' : 'Выберите категорию(и) для метки'}
                </p>
                <ul className={styles.categoriesList}>
                    {categories.map((category, idx) => {
                        return <Category 
                                    key={idx} 
                                    type={category.type} 
                                    img={category.img} 
                                    onCategoryClick={(e) => clickCategoryHandler(e, category.type)}
                                />
                    })}
                </ul>
            </div>
            { isSelectedCategory 
                ? <div className={styles.aboutPlace}>
                    <div className={styles.locate}>
                        <div className={`${styles.locateBtn} ${styles.activeLocate}`}>Ближайшие</div>
                        <div className={styles.locateBtn}>Весь город</div>
                    </div>
                    <ul className={styles.places}>
                        <Place/>
                        <Place/>
                        <Place/>
                    </ul>
                </div>
                : ''}
            { target
                ? <form>
                    <p>
                        <span>Адрес</span>
                        <input type="text" placeholder="Введите адрес пункта приема"/>
                    </p>
                    <p>
                        <span>Описание</span>
                        <textarea type="text" placeholder="Введите описание пункта приема"></textarea>
                    </p>
                </form>
                : '' }
        </div>
    )
}

export default Card