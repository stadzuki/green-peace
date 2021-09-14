import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AppContext from '../../context';

import Category from '../Category';
import Place from '../Place';

import styles from './Card.module.scss';
import transcription from '../../transcription';
import Select from '../Select/Select';

let selectedCategory = [];
let selectedCategoryC = [];

const timeRegex = /^[0-9]{0,1}[0-9]?\:[0-9]{2}$/
const phoneRegex = /^\+[0-9]+$/

const url = 'https://38d6-188-119-45-172.ngrok.io'

// при наведении на маркер выводить мета инфу

function Card() {
    const [category, setCategory] = useState([])
    const [city, setCity] = useState('')
    const [adress, setAdress] = useState('')
    const [namePlace, setNamePlace] = useState('')
    const [timeWorkStart, setTimeWorkStart] = useState('')
    const [timeWorkFinish, setTimeWorkFinish] = useState('')
    const [markersCopy, setMarkersCopy] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState('')
    const [website, setWebsite] = useState('')
    const [descriptionPlace, setDescriptionPlace] = useState('')
    const [photoFile, setPhotoFile] = useState([])
    const [invalidField, setInvalidField] = useState('')

    const [isSelectedCategory, setIsSelectedCategory] = useState(false)
    const {target,
            setTarget,
            isMarkerCreate,
            setIsMarkerCreate,
            setMarkers,
            markers,
            newMarker,
            currentLang,
            setMapCoord} = React.useContext(AppContext)

    // const fields = [
    //     {name: 'city', title: transcription[currentLang].inputsTitles.city, value: city, setter: setCity, placeholder: transcription[currentLang].inputsPlaceholders.city},
    //     {name: 'adress', title: transcription[currentLang].inputsTitles.adress, value: adress, setter: setAdress, placeholder: transcription[currentLang].inputsPlaceholders.adress},
    //     {name: 'namePlace', title: transcription[currentLang].inputsTitles.name, value: namePlace, setter: setNamePlace, placeholder: transcription[currentLang].inputsPlaceholders.name},
    //     {name: 'phoneNumber', title: transcription[currentLang].inputsTitles.phone, value: phoneNumber, setter: setPhoneNumber, placeholder: transcription[currentLang].inputsPlaceholders.phone},
    //     {name: 'website', title: transcription[currentLang].inputsTitles.webSite, value: website, setter: setWebsite, placeholder: transcription[currentLang].inputsPlaceholders.webSite},
    //     {name: 'descriptionPlace', title: transcription[currentLang].inputsTitles.description, value: descriptionPlace, setter: setDescriptionPlace, placeholder: transcription[currentLang].inputsPlaceholders.description},
    // ]

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

    const chooseCity = (company) => {
        setMapCoord((prev) => {
            return {...prev, latitude: company.latitude,  longitude: company.longitude}
        })
    }

    useEffect(() => {
        if(target) {
            // document.querySelectorAll('.category-item').forEach(item => item.classList.remove('selected'))
        }
    })

    const appendCategory = (evt, typeCategory) => {
        if(selectedCategory.includes(typeCategory)) {
            selectedCategory = selectedCategory.filter(item => item !== typeCategory);

            if(evt.target.tagName === 'IMG') {
                evt.target.parentNode.classList.remove('selected');
            } else {
                evt.target.classList.remove('selected');
            }
            return 1;
        }

        if(evt.target.tagName === 'IMG') {
            evt.target.parentNode.classList.add('selected');
        } else {
            evt.target.classList.add('selected');
        }

        selectedCategory.push(typeCategory)
    } 

    function removeDuplicates(arr) {

        const result = [];
        const duplicatesIndices = [];
    
        // Перебираем каждый элемент в исходном массиве
        arr.forEach((current, index) => {
        
            if (duplicatesIndices.includes(index)) return;
        
            result.push(current);
        
            // Сравниваем каждый элемент в массиве после текущего
            for (let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {
            
                const comparison = arr[comparisonIndex];
                const currentKeys = Object.keys(current);
                const comparisonKeys = Object.keys(comparison);
                
                // Проверяем длину массивов
                if (currentKeys.length !== comparisonKeys.length) continue;
                
                // Проверяем значение ключей
                const currentKeysString = currentKeys.sort().join("").toLowerCase();
                const comparisonKeysString = comparisonKeys.sort().join("").toLowerCase();
                if (currentKeysString !== comparisonKeysString) continue;
                
                // Проверяем индексы ключей
                let valuesEqual = true;
                for (let i = 0; i < currentKeys.length; i++) {
                    const key = currentKeys[i];
                    if ( current[key] !== comparison[key] ) {
                        valuesEqual = false;
                        break;
                    }
                }
                if (valuesEqual) duplicatesIndices.push(comparisonIndex);
                
            } // Конец цикла
        });  
        return result;
    }

    const clickCategoryHandler = (evt, typeCategory) => {
        if(target) {
            if(selectedCategory.includes(typeCategory)) {
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
            setCategory(selectedCategory);
            console.log(category);
            console.log(selectedCategory);
        } else {
            let sortFrom;

            switch(typeCategory) {
                case 'paper':
                    sortFrom = 1;
                    break;
                case 'glass':
                    sortFrom = 2;
                    break;
                case 'bottle':
                    sortFrom = 3;
                    break;
                case 'tin':
                    sortFrom = 4;
                    break;
                case 'clothes':
                    sortFrom = 5;
                    break;
                case 'gadget':
                    sortFrom = 6;
                    break;
                case 'radioactive':
                    sortFrom = 7;
                    break;
                case 'battery':
                    sortFrom = 8;
                    break;
                case 'lamp':
                    sortFrom = 9;
                    break;
                case 'technique':
                    sortFrom = 10;
                    break;
                case 'package':
                    sortFrom = 11;
                    break;
                case 'beer':
                    sortFrom = 12;
                    break;
                case 'tires':
                    sortFrom = 13;
                    break;
                default: 
                    sortFrom = 1;
                    break;
            }

            if(selectedCategoryC.includes(typeCategory)) {
                setMarkers(prev => prev.filter(e => !e.categoriesId.includes(sortFrom)))
            } else if(selectedCategoryC.length > 0) {
                let sorted = [...markers];
                let newSort = [];

                newSort = [...markersCopy]
                newSort.filter(m => m.categoriesId.includes(sortFrom))
                newSort = [...sorted, ...newSort.filter(m => m.categoriesId.includes(sortFrom))]
                sorted = [...newSort]
                sorted = removeDuplicates(sorted)
                
                setMarkers(sorted)
            }


            if(selectedCategoryC.length <= 0) {
                setMarkersCopy(markers)
                setMarkers((prev) => prev.filter(m => m.categoriesId.includes(sortFrom)))
            }

            appendCategory(evt, typeCategory);
        }

    }

    const inputHandler = (evt, model, regex = '') => {
        const {target} = evt;

        if(regex) {
            if(target.value.search(regex) === -1) {
                target.style.border = '0.5px solid #b8233c';
            } else {
                target.style.border = '0.5px solid #23b839';
            }
            model(target.value)
            return;
        } 

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
    }

    function uploadPhotoHandler(e) {
        console.log(e);
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = function() {
            setPhotoFile(reader.result.slice(23));
        }
        reader.readAsDataURL(file);
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

    const onClose = () => {
        setCity('')
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
        setIsMarkerCreate(false);

        document.querySelectorAll('.category-item').forEach(item => item.classList.remove('selected'))
    }

    const createMarkerOnClick = (e) => {
        e.preventDefault();

        if(city.length <= 0) {
            return setInvalidField('Вы не указали название города');
        }

        if(category.length <= 0) {
            return setInvalidField('Вы не указали категории');
        }

        if(adress.length <= 0) {
            return setInvalidField('Вы не указали адрес компании');
        }

        if(namePlace.length <= 0) {
            return setInvalidField('Вы не указали название компании');
        }

        if(timeWorkStart.length <= 0) {
            return setInvalidField('Вы не указали начало рабочего дня');
        }

        if(timeWorkStart.search(timeRegex) === -1 || timeWorkFinish.search(timeRegex)) {
            return setInvalidField('Время рабочего дня указано некорректно');
        }

        if(timeWorkFinish.length <= 0) {
            return setInvalidField('Вы не указали конец рабочего дня');
        }

        if(phoneNumber.length <= 0) {
            return setInvalidField('Вы не указали номер телефона компании');
        }

        if(phoneNumber.search(phoneRegex) === -1) {
            return setInvalidField('Вы некорректно указали номер телефона компании');
        }

        if(website.length <= 0) {
            return setInvalidField('Вы не указали сайт компании');
        }

        if(descriptionPlace.length <= 0) {
            return setInvalidField('Вы не указали описание компании');
        }

        if(photoFile.length <= 0) {
            return setInvalidField('Вы не прикрепили фото компании');
        }

        let categoriesId = [];
        for(let item of selectedCategory) {
            switch(item) {
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
        const data = {
            id: 0,
            title: namePlace,
            description: descriptionPlace,
            latitude: newMarker.latitude,
            longitude: newMarker.longitude,
            address: adress,
            workStart: timeWorkStart,
            workFinish: timeWorkFinish,
            phoneNumber: phoneNumber,
            city: city.toLowerCase(),
            webSiteUrl: website,
            imageUrl: photoFile,
            categoriesId
        }
        
        axios.post(`${url}/api/Company/AddCompany`, data)
            .then((resp) => {
                console.log(resp);
            })
            .catch((error) => {
                console.log(error);
            })

        onClose();
    }

    return (
        <div className={`${styles.cardContainer} ${styles.categoryCard} ${target ? styles.scroll : ''}`}>
            <div className={styles.cardCategories}>
                {!target ? <Select companies={markers} cityClick={chooseCity}/> : ''}
                <p className={styles.categoriesTitle}>
                    {!target ? transcription[currentLang].cardCategoryTitle : transcription[currentLang].createCompanyTitle}
                </p>
                {target ? <img className={styles.compayClose} width="10" src="/img/cancel.png" alt="close" onClick={onClose}/> : ''}
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
            { isSelectedCategory && !target
                ? <div className={styles.aboutPlace}>
                    <div className={styles.locate}>
                        <div className={`${styles.locateBtn} ${styles.activeLocate}`}>{transcription[currentLang].cardCategoryClose}</div>
                        <div className={styles.locateBtn}>{transcription[currentLang].cardCategoryAll}</div>
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
                        <span>{transcription[currentLang].inputsTitles.city}</span>
                        <input type="text" value={city} onChange={(e) => inputHandler(e, setCity)} placeholder={transcription[currentLang].inputsPlaceholders.city}/>
                    </p>
                    <p>
                        <span>{transcription[currentLang].inputsTitles.adress}</span>
                        <input type="text" value={adress} onChange={(e) => inputHandler(e, setAdress)} placeholder={transcription[currentLang].inputsPlaceholders.adress}/>
                        {isMarkerCreate
                            ? isMarkerCreate === 'INIT' 
                                ? <div className={styles.fileUpload} style={{marginBottom: 10}}>
                                    <p className={styles.fileUploadTitle}>{transcription[currentLang].pointTag}</p>
                                    <div className={styles.fileUploadCancel} onClick={removeMarker}>{transcription[currentLang].pointCancel}</div>
                                </div>
                                : <div className={styles.fileUpload} style={{marginBottom: 10}}>
                                    <p className={styles.fileUploadTitle}>{transcription[currentLang].pointTitle}</p>
                                </div>
                            
                            : <button className={styles.pointOnMap} onClick={createMarkerHandler}>{transcription[currentLang].pointOnMap}</button>
                        }
                    </p>
                    <p>
                        <span className={styles.workTimeTitle}>{transcription[currentLang].inputsTitles.timeWork}</span>
                        <div className={styles.workTime}>
                            <span>{transcription[currentLang].inputsTitles.workFrom}</span>
                            <input className={styles.workTimeInput} type="text" value={timeWorkStart} onChange={(e) => inputHandler(e, setTimeWorkStart, timeRegex)} placeholder="8:00"/>
                            <span>{transcription[currentLang].inputsTitles.workUntil}</span>
                            <input className={styles.workTimeInput} type="text" value={timeWorkFinish} onChange={(e) => inputHandler(e, setTimeWorkFinish, timeRegex)} placeholder="22:00"/>
                        </div>
                    </p>
                    <p>
                        <span>{transcription[currentLang].inputsTitles.name}</span>
                        <input type="text" value={namePlace} onChange={(e) => inputHandler(e, setNamePlace)} placeholder={transcription[currentLang].inputsPlaceholders.name}/>
                    </p>
                    <p>
                        <span>{transcription[currentLang].inputsTitles.phone}</span>
                        <input type="text" value={phoneNumber} onChange={(e) => inputHandler(e, setPhoneNumber, phoneRegex)} placeholder={transcription[currentLang].inputsPlaceholders.phone}/>
                    </p>
                    <p>
                        <span>{transcription[currentLang].inputsTitles.webSite}</span>
                        <input type="text" value={website} onChange={(e) => inputHandler(e, setWebsite)} placeholder={transcription[currentLang].inputsPlaceholders.webSite}/>
                    </p>
                    <p>
                        <span>{transcription[currentLang].inputsTitles.description}</span>
                        <textarea type="text" value={descriptionPlace} onChange={(e) => inputHandler(e, setDescriptionPlace)} placeholder={transcription[currentLang].inputsPlaceholders.description}></textarea>
                    </p>
                    {photoFile.length > 0 
                        ? <div className={styles.fileUpload} style={{marginTop: 10}}>
                            <p className={styles.fileUploadTitle}>{transcription[currentLang].fileUpload}</p>
                            <div className={styles.fileUploadCancel} onClick={cancelUploadHandler}>{transcription[currentLang].fileCancel}</div>
                        </div>
                        : <div className="input__wrapper">
                            <p className="upload-file-title">{transcription[currentLang].inputsTitles.img}</p>
                            <input name="file" type="file" accept="image/jpeg" value={photoFile} id="input__file" className="input input__file" multiple onChange={uploadPhotoHandler}/>
                            <label htmlFor="input__file" className="input__file-button">
                                <span className="input__file-icon-wrapper"><img className="input__file-icon" src="/img/add.svg" alt="Выбрать файл" width="25" /></span>
                                <span className="input__file-button-text">{transcription[currentLang].chooseFile}</span>
                            </label>
                        </div>
                    }
                    
                    <small style={{textAlign: 'center', color: '#ff002b'}}>{invalidField}</small>
                    <button onClick={createMarkerOnClick}>{transcription[currentLang].createPoint}</button>
                </form>
                : '' }
        </div>
    )
}

export default Card