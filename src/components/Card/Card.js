import axios from 'axios';
import React, { useState } from 'react';
import AppContext from '../../context';

import Category from '../Category';
import Place from '../Place';

import styles from './Card.module.scss';

let selectedCategory = [];
let selectedItem;

const url = 'http://7bbd-188-119-45-172.ngrok.io'

function Card() {
    const [city, setCity] = useState('')
    const [category, setCategory] = useState([])
    const [adres, setAdres] = useState({})
    const [namePlace, setNamePlace] = useState({})
    const [timeWork, setTimeWork] = useState({})
    const [descriptionPlace, setDescriptionPlace] = useState({})
    const [photoFile, setPhotoFile] = useState({})

    const [isSelectedCategory, setIsSelectedCategory] = React.useState(false)
    const {target, setTarget} = React.useContext(AppContext)


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

    const clickCategoryHandler = (evt, typeCategory) => {
        if(target) {
            if(selectedCategory.includes(typeCategory)) {
                console.log('include');
                selectedCategory = selectedCategory.filter(item => item !== typeCategory);

                if(evt.target.tagName === 'IMG') {
                    evt.target.parentNode.classList.remove('selected');
                } else {
                    evt.target.classList.remove('selected');
                }

                setCategory(selectedCategory)
                return 1;
            }

            if(evt.target.tagName === 'IMG') {
                evt.target.parentNode.classList.add('selected');
            } else {
                evt.target.classList.add('selected');
            }

            selectedCategory.push(typeCategory)
            setCategory(selectedCategory)
            console.log(category);
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
                if(selectedItem == eTarget) {
                    eTarget.classList.remove('selected');
                    setIsSelectedCategory(false)
                } else {
                    selectedItem.classList.remove('selected')
                    eTarget.classList.add('selected')
                    selectedItem = eTarget;
                }
            }

            // Описать логику получения данных о категории в опеределенном выбранном городе!
        }

    }

    const selectHandler = (e) => {
        setCity(e.target.value)
    }

    //Описать логику вставки добавления метки на карту target/setTargets
    return (
        <div className={`${styles.innerCard} ${styles.cardContainer} ${target ? styles.scroll : ''}`}>
            {/* создать свой компоненты выподающего списка */}
            <div className={styles.selectList}>
                <select name="city-list" onChange={selectHandler}>
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
                        <input type="text" placeholder="Укажите адрес пункта приема"/>
                        <button className={styles.pointOnMap}>Указать на карте</button>
                    </p>
                    <p>
                        <span>Название</span>
                        <input type="text" placeholder="Укажите название пункта приема"/>
                    </p>
                    <p>
                        <span>Период работы</span>
                        <input type="text" placeholder="Укажите название пункта приема"/>
                    </p>
                    <p>
                        <span>Номер телефона</span>
                        <input type="text" placeholder="Укажите номер телефона пункта приема"/>
                    </p>
                    <p>
                        <span>Сайт</span>
                        <input type="text" placeholder="Укажите сайт пункта приема"/>
                    </p>
                    <p>
                        <span>Описание</span>
                        <textarea type="text" placeholder="Укажите описание пункта приема"></textarea>
                    </p>
                    <div className="input__wrapper">
                        <p className="upload-file-title">Укажите фото пункта приема</p>
                        <input name="file" type="file" name="file" id="input__file" className="input input__file" multiple />
                        <label htmlFor="input__file" className="input__file-button">
                            <span className="input__file-icon-wrapper"><img className="input__file-icon" src="/img/add.svg" alt="Выбрать файл" width="25" /></span>
                            <span className="input__file-button-text">Выберите файл</span>
                        </label>
                    </div>

                    <button onClick={(e) => {
                        e.preventDefault();
                        const data = {
                            id: 0,
                            title: 'ООО Сдача бумаги',
                            description: 'Мы принимаем бумагу и жестянки',
                            latitude: 53.893009,
                            longitude: 27.567444,
                            address: 'ул. Репина постройка 2',
                            workTime: '08:00-23:00',
                            phoneNumber: '+7123123123',
                            webSiteUrl: 'sdacha.ru',
                            imageUrl: 'service.ru/img.png',
                            categoriesId: [1, 4]
                        }

                        axios.post(`${url}/api/Company/AddCompany`, data)
                            .then((resp) => {
                                console.log(resp);
                            })
                            .catch((error) => {
                                console.log(error);
                            })
                    }}>Создать метку</button>
                </form>
                : '' }
        </div>
    )
}

export default Card