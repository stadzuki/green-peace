import React, { useState } from 'react';
import AppContext from '../../context';
import axios from 'axios';

import transcription from '../../utils/transcription';
import styles from './CreateCard.module.scss';

const url = 'https://648c-188-119-45-172.ngrok.io'

const timeRegex = /^[0-9]{0,1}[0-9]?\:[0-9]{2}$/
const phoneRegex = /^\+[0-9]+$/

function CreateCard({category, setCategory}) {
    const [city, setCity] = useState('')
    const [adress, setAdress] = useState('')
    const [namePlace, setNamePlace] = useState('')
    const [timeWorkStart, setTimeWorkStart] = useState('')
    const [timeWorkFinish, setTimeWorkFinish] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [website, setWebsite] = useState('')
    const [descriptionPlace, setDescriptionPlace] = useState('')
    const [photoFile, setPhotoFile] = useState([])
    const [invalidField, setInvalidField] = useState('')

    const {
        setTarget,
        isMarkerCreate,
        setIsMarkerCreate,
        setMarkers,
        newMarker,
        currentLang
    } = React.useContext(AppContext)

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
        setIsMarkerCreate(true)
    }

    function uploadPhotoHandler(e) {
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

        setMarkers(prev => prev.filter(m => m.id !== 0))
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
            categoriesId: category
        }
        
        axios.post(`${url}/api/Company/AddCompany`, data)
            .then((resp) => {
                console.log('resp');
            })
            .catch((error) => {
                console.log(error);
            })

        onClose();
    }

    return (
        <div>
            <img className={styles.compayClose} width="10" src="/img/cancel.png" alt="close" onClick={onClose}/>
            <form>
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
        </div>
    )
}

export default CreateCard