import axios from 'axios';
import React, { useState } from 'react';
import AppContext from '../../context';

import Category from '../Category';
import Place from '../Place';

import styles from './Card.module.scss';

let selectedCategory = [];
let selectedItem;

const url = 'http://d824-188-119-45-172.ngrok.io'

//Снимать selected с категорий

function Card() {
    const [category, setCategory] = useState([])
    const [adress, setAdress] = useState('')
    const [namePlace, setNamePlace] = useState('')
    const [timeWorkStart, setTimeWorkStart] = useState('')
    const [timeWorkFinish, setTimeWorkFinish] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [website, setWebsite] = useState('')
    const [descriptionPlace, setDescriptionPlace] = useState('')
    const [photoFile, setPhotoFile] = useState([])

    const [isSelectedCategory, setIsSelectedCategory] = React.useState(false)
    const {target, setTarget, isMarkerCreate, setIsMarkerCreate, setMarkers, markers, setMarkerCategories, newMarker} = React.useContext(AppContext)


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
                if(selectedItem === eTarget) {
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

    const inputHandler = (evt, model) => {
        const {target} = evt;

        if(target.value.length <= 0) {
            target.style.border = '0.5px solid #b8233c';
        } else {
            target.style.border = '0.5px solid #23b839';
        }

        model(target.value)
    }

    const createMarkerHandler = (e) => {
        e.preventDefault();

        if(category.length <= 0) return console.log('Вы не указали категории');
        setIsMarkerCreate(true)
        setMarkerCategories(category)
    }

    const uploadPhotoHandler = (e) => {
        setPhotoFile(e.target.files);
    }

    const cancelUploadHandler = (e) => {
        setPhotoFile([]);
    }

    const removeMarker = () => {
        setIsMarkerCreate(false);
        setMarkers((prev) => {
            return prev.filter(obj => obj.id !== 0)
        })
    }

    const createMarkerOnClick = (e) => {
        e.preventDefault();

        //create notif
        if(category.length <= 0) {
            return console.log('Вы не указали категории');
        }

        if(adress.length <= 0) {
            return console.log('Вы не указали адрес компании');
        }

        if(namePlace.length <= 0) {
            return console.log('Вы не указали название компании');
        }

        if(timeWorkStart.length <= 0) {
            return console.log('Вы не указали начало рабочего дня');
        }

        if(timeWorkFinish.length <= 0) {
            return console.log('Вы не указали конец рабочего дня');
        }

        if(phoneNumber.length <= 0) {
            return console.log('Вы не указали номер телефона компании');
        }

        if(website.length <= 0) {
            return console.log('Вы не указали сайт компании');
        }

        if(descriptionPlace.length <= 0) {
            return console.log('Вы не указали описание компании');
        }

        if(photoFile.length <= 0) {
            return console.log('Вы не прикрепили фото компании');
        }

        let categoriesId = [];

        for(let item of category) {
            switch(item.type) {
                case 'paper':
                    categoriesId.push(1)
                    break;
                case 'glass':
                    categoriesId.push(2)
                    break;
                case 'bottle':
                    categoriesId.push(3)
                    break;
                case 'tin':
                    categoriesId.push(4)
                    break;
                case 'clothes':
                    categoriesId.push(5)
                    break;
                case 'gadget':
                    categoriesId.push(6)
                    break;
                case 'radioactive':
                    categoriesId.push(7)
                    break;
                case 'battery':
                    categoriesId.push(8)
                    break;
                case 'lamp':
                    categoriesId.push(9)
                    break;
                case 'technique':
                    categoriesId.push(10)
                    break;
                case 'package':
                    categoriesId.push(11)
                    break;
                case 'beer':
                    categoriesId.push(12)
                    break;
                case 'tires':
                    categoriesId.push(13)
                    break;
            }
        }

        // const formData = new FormData();
        // formData.append('image', photoFile[0]);

        const data = {
            id: 0,
            title: namePlace,
            description: descriptionPlace,
            latitude: newMarker.latitude,
            longitude: newMarker.longitude,
            address: adress,
            workTime: timeWorkStart + '-' + timeWorkFinish,
            phoneNumber: phoneNumber,
            webSiteUrl: website,
            imageUrl: 'service.ru/img.png',
            categoriesId
        }

        // axios.post(`${url}/api/Company/AddCompany`, data)
        //     .then((resp) => {
        //         console.log(resp);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })

        setCategory([])
        setAdress('')
        setNamePlace('')
        setTimeWorkStart('')
        setTimeWorkFinish('')
        setPhoneNumber('')
        setWebsite('')
        setDescriptionPlace('')
        setPhotoFile([])
        setTarget(false)
    }

    return (
        <div className={`${styles.innerCard} ${styles.cardContainer} ${target ? styles.scroll : ''}`}>
            <div className={styles.categoryCard}>
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
                        <input type="text" value={adress} onChange={(e) => inputHandler(e, setAdress)} placeholder="Укажите адрес пункта приема"/>
                        {isMarkerCreate
                            ? isMarkerCreate === 'INIT' 
                                ? <div className={styles.fileUpload} style={{marginBottom: 10}}>
                                    <p className={styles.fileUploadTitle}>Метка создана</p>
                                    <div className={styles.fileUploadCancel} onClick={removeMarker}>Отменить</div>
                                </div>
                                : <div className={styles.fileUpload} style={{marginBottom: 10}}>
                                    <p className={styles.fileUploadTitle}>Создайте метку на карте</p>
                                </div>
                            
                            : <button className={styles.pointOnMap} onClick={createMarkerHandler}>Указать на карте</button>
                        }
                    </p>
                    <p>
                        <span className={styles.workTimeTitle}>Период работы</span>
                        <div className={styles.workTime}>
                            <span>с</span>
                            <input className={styles.workTimeInput} type="text" value={timeWorkStart} onChange={(e) => inputHandler(e, setTimeWorkStart)} placeholder="8:00"/>
                            <span>до</span>
                            <input className={styles.workTimeInput} type="text" value={timeWorkFinish} onChange={(e) => inputHandler(e, setTimeWorkFinish)} placeholder="22:00"/>
                        </div>
                    </p>
                    <p>
                        <span>Название</span>
                        <input type="text" value={namePlace} onChange={(e) => inputHandler(e, setNamePlace)} placeholder="Укажите название пункта приема"/>
                    </p>
                    <p>
                        <span>Номер телефона</span>
                        <input type="text" value={phoneNumber} onChange={(e) => inputHandler(e, setPhoneNumber)} placeholder="Укажите номер телефона пункта приема"/>
                    </p>
                    <p>
                        <span>Сайт</span>
                        <input type="text" value={website} onChange={(e) => inputHandler(e, setWebsite)} placeholder="Укажите сайт пункта приема"/>
                    </p>
                    <p>
                        <span>Описание</span>
                        <textarea type="text" value={descriptionPlace} onChange={(e) => inputHandler(e, setDescriptionPlace)} placeholder="Укажите описание пункта приема"></textarea>
                    </p>
                    {photoFile.length > 0 
                        ? <div className={styles.fileUpload} style={{marginTop: 10}}>
                            <p className={styles.fileUploadTitle}>Файл загружен</p>
                            <div className={styles.fileUploadCancel} onClick={cancelUploadHandler}>Отменить</div>
                        </div>
                        : <div className="input__wrapper">
                            <p className="upload-file-title">Укажите фото пункта приема</p>
                            <input name="file" type="file" value={photoFile} id="input__file" className="input input__file" multiple onChange={uploadPhotoHandler}/>
                            <label htmlFor="input__file" className="input__file-button">
                                <span className="input__file-icon-wrapper"><img className="input__file-icon" src="/img/add.svg" alt="Выбрать файл" width="25" /></span>
                                <span className="input__file-button-text">Выберите файл</span>
                            </label>
                        </div>
                    }
                    

                    <button onClick={createMarkerOnClick}>Создать метку</button>
                </form>
                : '' }
            </div>
            <div className={styles.companyCard}>
                <p className={styles.companyTitle}>Прием бумаги - Дубки у Валентины</p>
                <div className={styles.companyImage}>
                    <img src="/img/mock-comp.png" alt="company photo"/>
                </div>
                <div className={styles.companyMark}>
                    <div className={styles.markCount}>
                        <div className={styles.markNumber}>1</div>
                        <p className={styles.markText}>1 оценка</p>
                    </div>
                    <div className={styles.markAction}>
                        <div className={`${styles.markLike} ${styles.markEst}`}>
                            <img src="/img/like.png" width="25" height="25" alt="like"/>
                        </div>
                        <div className={`${styles.markDislike} ${styles.markEst}`}>
                            <img src="/img/dislike.png" width="25" height="25" alt="dislike"/>
                        </div>
                    </div>
                </div>
                <div className={styles.communicate}>
                    <ul className={styles.communicateList}>
                        <li className={styles.communicateItem}>
                            <img src="/img/report.png" width="35" height="35" alt="report icon"/>
                        </li>
                        <li className={styles.communicateItem}>
                            <img src="/img/phone.png" width="35" height="35" alt="phone icon"/>
                        </li>
                        <li className={styles.communicateItem}>
                            <img src="/img/route.png" width="35" height="35" alt="route icon"/>
                        </li>
                        <li className={styles.communicateItem}>
                            <img src="/img/comment.png" width="35" height="35" alt="comment icon"/>
                        </li>
                    </ul>
                </div>
                <div className={styles.companyLocate}>г. Москва, Петровка улица 24</div>
                <div className={styles.specialize}><span>Принимают:</span> бумага, крышечки</div>
                <div className={styles.generalInfo}>
                    <div className={styles.generalTitle}>Общая информация</div>
                    <p className={styles.generalDescription}>В контейнер для "Добрых крышечек" можно сдать:
                    ЧИСТЫЕ пластиковые отвинчивающиеся крышечки от напитков. Собранные крышки направляются
                    "Добрые крышечки" - благотворительный проект по сбору пластиковых крышечек для помощи детям с </p>
                </div>
            </div>
        </div>
    )
}

export default Card