import React, { useState } from 'react';
import AppContext from '../../context';
import axios from 'axios';
import Toggle from '../Toggle/Toggle';
import removeDublicates from '../../utils/removeDuplicates'
import transcription from '../../utils/transcription';
import styles from './CreateCard.module.scss';
import Schedule from '../Schedule/Shedule';

const url = 'https://92a5-188-119-45-172.ngrok.io'

const timeRegex = /^[0-9]{2}[0-9]?\:[0-9]{2}$/
const phoneRegex = /^\+[0-9]+$/

function CreateCard({category, setCategory}) {
    const [city, setCity] = useState('')
    const [adress, setAdress] = useState('')
    const [namePlace, setNamePlace] = useState('')
    const [timeWorkStart, setTimeWorkStart] = useState('')
    const [timeWorkFinish, setTimeWorkFinish] = useState('')
    const [timeCoffeeStart, setTimeCoffeeStart] = useState('')
    const [timeCoffeeFinish, setTimeCoffeeFinish] = useState('')
    const [weekends, setWeekends] = useState('')
    const [isAllTime, setIsAllTime] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [website, setWebsite] = useState('')
    const [descriptionPlace, setDescriptionPlace] = useState('')
    const [photoFile, setPhotoFile] = useState([])
    const [schedule, setSchedule] = useState([
        {id: 0, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
        {id: 1, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
        {id: 2, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
        {id: 3, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
        {id: 4, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
        {id: 5, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
        {id: 6, isToggle: false, firstFieldValue: '', secondFieldValue: ''}
    ])
    const [invalidField, setInvalidField] = useState('')
    const [isScheduleOpen, setIsScheduleOpen] = useState(false)

    const {
        setTarget,
        isMarkerCreate,
        setIsMarkerCreate,
        setMarkers,
        setNewMarker,
        newMarker,
        currentLang
    } = React.useContext(AppContext)

    const scheduleItems = [
        {name: 'Понедельник', idx: 0},
        {name: 'Вторник', idx: 1},
        {name: 'Среда', idx: 2},
        {name: 'Четверг', idx: 3},
        {name: 'Пятница', idx: 4},
        {name: 'Суббота', idx: 5},
        {name: 'Воскресенье', idx: 6}
    ]

    const weekendsClickHanlder = (e, type) => {
        const children = e.target.parentNode.childNodes.forEach(item => item.classList.remove(styles.weekendsDaySelected));
        if(weekends === type) {
            setWeekends('');
            return 1;
        } 
        e.target.classList.add(styles.weekendsDaySelected);
        setWeekends(type)
    }

    const scheduleToggleClick = (idx) => {
        const data = schedule[idx]
        data.isToggle = !data.isToggle;
        setSchedule((prev) => removeDublicates([...prev, data]))
    }

    const scheduleChangeHandler = (evt, idx, field) => {
        const {target} = evt;

        if(target.value.search(timeRegex) === -1) {
            target.style.border = '0.5px solid #b8233c';
        } else {
            target.style.border = '0.5px solid #23b839';
        }

        setSchedule(prev => prev.map((item, id) => {
            if(id === idx) {
                field === 'first' ? item.firstFieldValue = target.value : item.secondFieldValue = target.value
            }

            return item
        }))
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
        setIsMarkerCreate(true)
    }

    function uploadPhotoHandler(e) {
        let file = e.target.files[0];
        if(file.type !== "image/jpeg") {
            return alert('Изображение должно быть .jpeg формата')
        }
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
        setNewMarker(false)
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

        setSchedule([
            {id: 0, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
            {id: 1, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
            {id: 2, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
            {id: 3, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
            {id: 4, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
            {id: 5, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
            {id: 6, isToggle: false, firstFieldValue: '', secondFieldValue: ''}
        ])
        setIsScheduleOpen(false)
        setIsAllTime(false)
        setWeekends('')
        setTimeCoffeeFinish('')
        setTimeCoffeeStart('')
        setInvalidField('')

        setMarkers(prev => prev.filter(m => m.id !== 0))
        document.querySelectorAll('.category-item').forEach(item => item.classList.remove('selected'))
    }

    const createMarkerOnClick = (e) => {
        e.preventDefault();

        const isScheduleClear = () => {
            let rez = true;
            for(let s of schedule) {
                if(s.isToggle) {
                    if(s.firstFieldValue || s.secondFieldValue) {
                        rez = false;
                        break;
                    }
                }
            }

            return rez;
        }

        const isScheduleFullFileld = () => {
            const scheduleArr = [...schedule]
            let rez = false;

            for(let s of scheduleArr) {
                if(s.isToggle) {
                    if(s.firstFieldValue.length > 0 || s.secondFieldValue.length > 0) {
                        rez = true;
                        break;
                    }
                }
            }

            return rez;
        }

        if(city.length <= 0) {
            return setInvalidField('Вы не указали название города');
        }

        if(!newMarker) {
            return setInvalidField('Вы не указали метку на карте');
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

        if(
            timeWorkStart.search(timeRegex) === -1
            || timeWorkFinish.search(timeRegex) === -1
        ) {
            if(!isAllTime && isScheduleClear()) {
                return setInvalidField('Время рабочего дня указано некорректно');
            }
        }

        if(!weekends) {
            if(!isAllTime && isScheduleClear()) {
                return setInvalidField('Вы не выбрали выходные дни');
            }
        }

        if(
            timeCoffeeStart.search(timeRegex) === -1
            || timeCoffeeFinish.search(timeRegex) === -1
        ) {
            return setInvalidField('Время перерыва указано некорректно');
        }

        if(!isScheduleClear() && !isScheduleFullFileld() && !isAllTime) {
            return setInvalidField('Время рабочего дня заполнено не доконца');
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

        const getWorkTime = () => {
            if(isAllTime) {//without weekends
                return '24/7'
            } else if(isScheduleFullFileld()) {//with weekends
                const work = [...schedule]
                let time = '';

                for(let i = 0; i < work.length; i++) {
                    if(work[i].isToggle) {
                        time += work[i].firstFieldValue + '-' + work[i].secondFieldValue + '+'
                    } else {
                        time += 'none-none+'
                    }
                }
                
                return time.slice(0, time.length - 1);
            } else {
                let time = '';

                for(let i = 1; i <= 7; i++) {
                    if(weekends === 'sat') {
                        if(i === 6) {
                            time += 'none-none+'
                            continue;
                        }
                    }

                    if(weekends === 'sun') {
                        if(i === 7) {
                            time += 'none-none+'
                            continue;
                        }
                    }

                    if(weekends === 'sat-sun') {
                        if(i >= 6) {
                            time += 'none-none+'
                            continue;
                        }
                    }
                    time += timeWorkStart + '-' + timeWorkFinish + '+'
                }

                return time.slice(0, time.length - 1);
            }
        }

        const data = {
            id: 0,
            title: namePlace,
            description: descriptionPlace,
            latitude: newMarker.latitude,
            longitude: newMarker.longitude,
            address: adress,
            workTime: getWorkTime(),
            coffeTime: timeCoffeeStart + '-' + timeCoffeeFinish,
            phoneNumber: phoneNumber,
            isAllTime,
            city: city.toLowerCase(),
            webSiteUrl: website,
            imageUrl: photoFile,
            categoriesId: category
        }
        
        // axios.post(`${url}/api/Company/AddCompany`, data)
        //     .then((resp) => {
        //         console.log('resp');
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })

        onClose();
        console.log(data);
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
                    <div className={styles.workTimeContainer}>
                        <div className={styles.workTimeWrapper}>
                            <span className={styles.workTimeTitle}>{transcription[currentLang].inputsTitles.timeWork}</span>
                            <div className={styles.workTime}>
                                {/* <span>{transcription[currentLang].inputsTitles.workFrom}</span> */}
                                <input className={styles.workTimeInput} type="text" value={timeWorkStart} onChange={(e) => inputHandler(e, setTimeWorkStart, timeRegex)} placeholder="08:00"/>
                                <span>-</span>
                                <input className={styles.workTimeInput} style={{marginRight: 20}} type="text" value={timeWorkFinish} onChange={(e) => inputHandler(e, setTimeWorkFinish, timeRegex)} placeholder="22:00"/>
                            </div>
                        </div>
                        <div className={styles.workTimeWrapper}>
                            <span className={styles.workTimeTitle}>{transcription[currentLang].inputsTitles.timeCoffee}</span>
                            <div className={styles.workTime}>
                                {/* <span>{transcription[currentLang].inputsTitles.workFrom}</span> */}
                                <input className={styles.workTimeInput} type="text" value={timeCoffeeStart} onChange={(e) => inputHandler(e, setTimeCoffeeStart, timeRegex)} placeholder="08:00"/>
                                <span>-</span>
                                <input className={styles.workTimeInput} type="text" value={timeCoffeeFinish} onChange={(e) => inputHandler(e, setTimeCoffeeFinish, timeRegex)} placeholder="22:00"/>
                            </div>
                        </div>
                    </div>
                </p>
                <p>
                    <span className={styles.workTimeTitle}>Выходные</span>
                    <div className={styles.weekendsContainer}>
                        <div className={styles.weekendsDay} onClick={(e) => weekendsClickHanlder(e, 'sat')}>Сб.</div>
                        <div className={styles.weekendsDay} onClick={(e) => weekendsClickHanlder(e, 'sun')}>Вс.</div>
                        <div className={styles.weekendsDay} onClick={(e) => weekendsClickHanlder(e, 'sat-sun')}>Сб. и Вс.</div>
                    </div>
                </p>
                <p>
                    <div className="schedule">
                        <div
                            className={`scheduleBtn ${isScheduleOpen ? 'scheduleOpened' : ''}`}
                            onClick={() => setIsScheduleOpen((prev) => !prev)}
                        >
                            {isScheduleOpen ? 'Скрыть варианты графика' : 'Больше вариантов графика'}
                        </div>
                        {isScheduleOpen 
                            ? <div className="scheduleContent">
                                {scheduleItems.map((item, idx) => {
                                    return (
                                        <Schedule 
                                            key={idx}
                                            scheduleToggleClick={scheduleToggleClick}
                                            schedule={schedule[idx]}
                                            lang={currentLang}
                                            weekday={item.name}
                                            scheduleChangeHandler={scheduleChangeHandler}
                                            idx={idx}
                                        />
                                    )
                                })}
                            </div>
                            : ''
                        }
                    </div>
                </p>
                <p>
                    <div className={styles.allTime}>
                        <span>{transcription[currentLang].inputsTitles.allTime}</span>
                        <Toggle lang={currentLang} isToggle={isAllTime} toggleClick={() => setIsAllTime(prev => !prev)} isText={false}/>
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