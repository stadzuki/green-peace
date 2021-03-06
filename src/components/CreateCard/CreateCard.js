import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import AppContext from '../../context';
import axios from 'axios';
import Toggle from '../Toggle/Toggle';
import removeDublicates from '../../utils/removeDuplicates'
import transcription from '../../utils/transcription';
import styles from './CreateCard.module.scss';
import Schedule from '../Schedule/Shedule';
import Popup from '../Popup';

const url = 'https://localhost:44375'
// const url = 'https://3441-37-212-85-102.eu.ngrok.io'

const timeRegex = /^[0-9]{2}[0-9]?\:[0-9]{2}$/
const phoneRegex = /^\+([0-9]+[\s]?\-?)+$/

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
    const [isTimeValid, setTimeValid] = useState({})

    const {
        setTarget,
        isMarkerCreate,
        setIsMarkerCreate,
        setMarkers,
        markers,
        setNewMarker,//-
        newMarker,//-
        markersCopy,//-
        currentLang,
        setPopup
    } = React.useContext(AppContext)

    const scheduleItems = [
        {name: '??????????????????????', idx: 0},
        {name: '??????????????', idx: 1},
        {name: '??????????', idx: 2},
        {name: '??????????????', idx: 3},
        {name: '??????????????', idx: 4},
        {name: '??????????????', idx: 5},
        {name: '??????????????????????', idx: 6}
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

    const scheduleChangeHandler = (evt, idx, field, timeInput = '') => {
        const {target} = evt;

        const leftSide = parseInt(target.value.split(':')[0]);
        const rightSide = parseInt(target.value.split(':')[1]);

        if(target.value.search(timeRegex) !== -1 && +leftSide <= 23 && +leftSide >= 0 && +rightSide <= 59 && +rightSide >= 0) {
            target.style.border = '0.5px solid #23b839';
            setTimeValid(prev => ({...prev, [timeInput+idx]: true }))
        } else {
            target.style.border = '0.5px solid #b8233c';
            setTimeValid(prev => ({...prev, [timeInput+idx]: false }))
        }

        if(leftSide > 23 || rightSide > 59) {
            let tempValueLeft = leftSide > 9 ? leftSide : 0 + '' + leftSide;
            let tempValueRight = rightSide;

            if(leftSide > 23) {
                tempValueLeft = 23;
            }
            
            if(rightSide > 59) {
                tempValueRight = 59;
            }

            if(leftSide || rightSide) {

                target.value = tempValueLeft + ':' + tempValueRight;
                target.style.border = '0.5px solid #23b839';
            } else {
                target.style.border = '0.5px solid #b8233c';
            }

            if(target.value.search(timeRegex) === -1) {
                target.style.border = '0.5px solid #b8233c';
                setTimeValid(prev => ({...prev, [timeInput]: false }))
            } else {
                setTimeValid(prev => ({...prev, [timeInput]: true }))
            }
            // target.style.border = '0.5px solid #b8233c';
            // setTimeValid(prev => ({...prev, [timeInput]: false }))
        }

        setSchedule(prev => prev.map((item, id) => {
            if(id === idx) {
                field === 'first' ? item.firstFieldValue = target.value : item.secondFieldValue = target.value
            }

            return item
        }))
    }

    const inputHandler = (evt, model, regex = '', timeInput = '') => {
        const {target} = evt;
        
        if(regex === timeRegex) {
            const leftSide = parseInt(target.value.split(':')[0]);
            const rightSide = parseInt(target.value.split(':')[1]);

            if(target.value.search(timeRegex) !== -1 && leftSide <= 23 && leftSide >= 0 && rightSide <= 59 && rightSide >= 0) {
                target.style.border = '0.5px solid #23b839';
                setTimeValid(prev => ({...prev, [timeInput]: true }))
            } else {
                target.style.border = '0.5px solid #b8233c';
                setTimeValid(prev => ({...prev, [timeInput]: false }))
            }

            if(leftSide > 23 || rightSide > 59) {
                let tempValueLeft = leftSide > 9 ? leftSide : 0 + '' + leftSide;
                let tempValueRight = rightSide;

                if(leftSide > 23) {
                    tempValueLeft = 23;
                }
                
                if(rightSide > 59) {
                    tempValueRight = 59;
                }

                if(leftSide || rightSide) {

                    target.value = tempValueLeft + ':' + tempValueRight;
                    target.style.border = '0.5px solid #23b839';
                } else {
                    target.style.border = '0.5px solid #b8233c';
                }

                if(target.value.search(timeRegex) === -1) {
                    target.style.border = '0.5px solid #b8233c';
                    setTimeValid(prev => ({...prev, [timeInput]: false }))
                } else {
                    setTimeValid(prev => ({...prev, [timeInput]: true }))
                }
                // target.style.border = '0.5px solid #b8233c';
                // setTimeValid(prev => ({...prev, [timeInput]: false }))
            }

            model(target.value)
            return;
        } else if(regex) {
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
            return alert('?????????????????????? ???????????? ???????? .jpeg ??????????????')
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
        setMarkers(markersCopy)
        // setMarkers((prev) => {
        //     return prev.filter(obj => obj.id !== 0)
        // })
    }

    const onClose = (isPopup = false) => {
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

        // setMarkers(prev => prev.filter(m => m.id !== 0))
        setMarkers(markersCopy)
        document.querySelectorAll('.category-item').forEach(item => item.classList.remove('selected'))

        if(isPopup) {
            setPopup(true)
        }
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
            return setInvalidField('???? ???? ?????????????? ???????????????? ????????????');
        }

        // if(!newMarker) {
        //     return setInvalidField('???? ???? ?????????????? ?????????? ???? ??????????');
        // }

        if(category.length <= 0) {
            return setInvalidField('???? ???? ?????????????? ??????????????????');
        }

        if(adress.length <= 0) {
            return setInvalidField('???? ???? ?????????????? ?????????? ????????????????');
        }

        if(namePlace.length <= 0) {
            return setInvalidField('???? ???? ?????????????? ???????????????? ????????????????');
        }

        if(!isAllTime) {
            if(Object.values(isTimeValid).includes(false) || Object.values(isTimeValid).length < 0) {
                console.log(isTimeValid);
                console.log(timeWorkFinish);
                return setInvalidField('?????????? ???????????????? ?????? / ???????????????? ?????????????? ??????????????????????');
            }
        }
        
        if(
            timeWorkStart.search(timeRegex) === -1
            || timeWorkFinish.search(timeRegex) === -1
        ) {
            if(!isAllTime && isScheduleClear()) {
                return setInvalidField('?????????? ???????????????? ?????? ?????????????? ??????????????????????');
            }
        }

        if(!weekends) {
            if(!isAllTime && isScheduleClear()) {
                return setInvalidField('???? ???? ?????????????? ???????????????? ??????');
            }
        }

        const timeCoffeeStartLeftSide = parseInt(timeCoffeeStart.split(':')[0]);
        const timeCoffeeStartRightSide = parseInt(timeCoffeeStart.split(':')[1]);
        const timeCoffeeFinishLeftSide = parseInt(timeCoffeeFinish.split(':')[0]);
        const timeCoffeeFinishRightSide = parseInt(timeCoffeeFinish.split(':')[1]);


        if(
            timeCoffeeStartLeftSide > 23 || timeCoffeeStartLeftSide < 0 && timeCoffeeStartRightSide > 59 || timeCoffeeStartRightSide < 0 
        ) {
            return setInvalidField('?????????? ???????????????? ?????????????? ??????????????????????');
        }
        if(
            timeCoffeeFinishLeftSide > 23 || timeCoffeeFinishLeftSide < 0 && timeCoffeeFinishRightSide > 59 || timeCoffeeFinishRightSide < 0
        ) {
            return setInvalidField('?????????? ???????????????? ?????????????? ??????????????????????');
        }

        if(
            timeCoffeeStart.search(timeRegex) === -1
            || timeCoffeeFinish.search(timeRegex) === -1
        ) {
            return setInvalidField('?????????? ???????????????? ?????????????? ??????????????????????');
        }

        if(!isScheduleClear() && !isScheduleFullFileld() && !isAllTime) {
            return setInvalidField('?????????? ???????????????? ?????? ?????????????????? ???? ??????????????');
        }

        if(phoneNumber.length <= 0) {
            return setInvalidField('???? ???? ?????????????? ?????????? ???????????????? ????????????????');
        }

        if(phoneNumber.search(phoneRegex) === -1) {
            return setInvalidField('???? ?????????????????????? ?????????????? ?????????? ???????????????? ????????????????');
        }

        if(website.length <= 0) {
            return setInvalidField('???? ???? ?????????????? ???????? ????????????????');
        }

        if(descriptionPlace.length <= 0) {
            return setInvalidField('???? ???? ?????????????? ???????????????? ????????????????');
        }

        if(photoFile.length <= 0) {
            return setInvalidField('???? ???? ???????????????????? ???????? ????????????????');
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
            latitude: markers[0].latitude,
            longitude: markers[0].longitude,
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

        const fakeData = {
            address: "asdasd",
            categoriesId: [1, 8],
            city: "????????????",
            coffeTime: "12:32-12:32",
            description: "sadsadsad",
            id: 0,
            imageUrl: "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAcIC0ADASIAAhEBAxEB/8QAHAAAAwEBAQEBAQAAAAAAAAAAAAECAwQFBgcI/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQF/9oADAMBAAIQAxAAAAH4P1vI9fefGAj1uLt4q5u7h7k18z0/MXr7/P7jxPQ8/vjr8X2fGOzu4e2zyuzj7Dp8v1fJX2fP9DzifV8r1TxfW8n2E8nbHeXp870fNs9jyvV8o9Dm6eY0GjPo59zg9XyvVPP7+HvPN7+HuOTt4+1Y4O3hPS830fOT0+Ht4zfbDc4e3i7A4u3iO7g7+AO7g0Nbix6Zaiz1xC89DSWAEiaBuWITJjTKX6D4r7z53OvH5KkyV5iGgqaNmOwpUPfDez6nm7/Ps5MdM5eQBPqk5tKi0mhFIBXFGfRy9JShmqi5alyhNJZVI58erE+c4fa86XvvtwzfvPe/Jf1nz7877L5b0l9lNdsACgAAIgFGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAYAAALzejzvP3Ki/P2cXmLTLRUAjmpUY4PP9Lz830UzcAZLCKAoEyWEcu2O2dOWUmVZL0zGgigmkK81sWplLM3elWsicDSSuRw2KkDiOLu4d5blaxYnYZ6ZCqbAA59MdBZ3MeP3+X7Op1jFapEiSUmU2kLTPREqmgCISB52DsZDHTRAQ5ESRaFQgJSZTmhtCOLzoqQqHBGdZG2MI0vOkj4H77876Z+m+g8b282nVZpLkoGNNVKUxcwqZBJrCVv5z63ket7fP???",
            isAllTime: false,
            latitude: markers[0].latitude,
            longitude: markers[0].longitude,
            phoneNumber: "+1 232 132-13-12",
            title: "asdsadas",
            webSiteUrl: "123213213",
            workTime: "23:23-23:23+23:23-23:23+23:23-23:23+23:23-23:23+23:23-23:23+none-none+none-none",
        }

        // let headers = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"}
        axios.post(`${url}/api/Company/AddCompany`, data)
            .catch((error) => {
                console.log(error);
            })
            
        
        onClose(true);
        console.log(data);
    }

    return (
        <div>
            <img className={styles.compayClose} width="15" src="/img/cancel.png" alt="close" onClick={() => onClose(false)}/>
            <form>
                <p>
                    <span>{transcription[currentLang].inputsTitles.city}</span>
                    <input type="text" value={city} onChange={(e) => inputHandler(e, setCity)} placeholder={transcription[currentLang].inputsPlaceholders.city}/>
                </p>
                <p>
                    <span>{transcription[currentLang].inputsTitles.adress}</span>
                    <input type="text" value={adress} onChange={(e) => inputHandler(e, setAdress)} placeholder={transcription[currentLang].inputsPlaceholders.adress}/>
                    {/* {isMarkerCreate
                        ? isMarkerCreate === 'INIT' 
                            ? <div className={styles.fileUpload} style={{marginBottom: 10}}>
                                <p className={styles.fileUploadTitle}>{transcription[currentLang].pointTag}</p>
                                <div className={styles.fileUploadCancel} onClick={removeMarker}>{transcription[currentLang].pointCancel}</div>
                            </div>
                            : <div className={styles.fileUpload} style={{marginBottom: 10}}>
                                <p className={styles.fileUploadTitle}>{transcription[currentLang].pointTitle}</p>
                            </div>
                        
                        : <button className={styles.pointOnMap} onClick={createMarkerHandler}>{transcription[currentLang].pointOnMap}</button>
                    } */}
                </p>
                <p>
                    <div className={styles.workTimeContainer}>
                        <div className={styles.workTimeWrapper}>
                            <span className={styles.workTimeTitle}>{transcription[currentLang].inputsTitles.timeWork}</span>
                            <div className={styles.workTime}>
                                {/* <span>{transcription[currentLang].inputsTitles.workFrom}</span> */}
                                {/* <input className={styles.workTimeInput} type="text" value={timeWorkStart} onChange={(e) => inputHandler(e, setTimeWorkStart, timeRegex)} placeholder="08:00"/> */}
                                {/* <InputMask mask="+9 999 999-99-99" placeholder="?????????? ????????????????"/> */}
                                <InputMask className={styles.workTimeInput} value={timeWorkStart} onChange={(e) => inputHandler(e, setTimeWorkStart, timeRegex, 'startWork')} mask="99:99" placeholder="08:00" disabled={isScheduleOpen}/>
                                <span>-</span>
                                {/* <input className={styles.workTimeInput} style={{marginRight: 20}} type="text" value={timeWorkFinish} onChange={(e) => inputHandler(e, setTimeWorkFinish, timeRegex)} placeholder="22:00"/> */}
                                <InputMask className={styles.workTimeInput} style={{marginRight: 20}} value={timeWorkFinish} onChange={(e) => inputHandler(e, setTimeWorkFinish, timeRegex, 'finishWork')} mask="99:99" placeholder="22:00" disabled={isScheduleOpen}/>
                            </div>
                        </div>
                        <div className={styles.workTimeWrapper}>
                            <span className={styles.workTimeTitle}>{transcription[currentLang].inputsTitles.timeCoffee}</span>
                            <div className={styles.workTime}>
                                {/* <span>{transcription[currentLang].inputsTitles.workFrom}</span> */}
                                {/* <input className={styles.workTimeInput} type="text" value={timeCoffeeStart} onChange={(e) => inputHandler(e, setTimeCoffeeStart, timeRegex)} placeholder="08:00"/> */}
                                <InputMask className={styles.workTimeInput} value={timeCoffeeStart} onChange={(e) => inputHandler(e, setTimeCoffeeStart, timeRegex, 'startCoffee')} mask="99:99" placeholder="08:00"/>
                                <span>-</span>
                                {/* <input className={styles.workTimeInput} type="text" value={timeCoffeeFinish} onChange={(e) => inputHandler(e, setTimeCoffeeFinish, timeRegex)} placeholder="22:00"/> */}
                                <InputMask className={styles.workTimeInput} value={timeCoffeeFinish} onChange={(e) => inputHandler(e, setTimeCoffeeFinish, timeRegex, 'finishCoffee')} mask="99:99" placeholder="22:00"/>
                            </div>
                        </div>
                    </div>
                </p>
                <p>
                    <span className={styles.workTimeTitle}>????????????????</span>
                    <div className={styles.weekendsContainer}>
                        <div className={styles.weekendsDay} onClick={(e) => weekendsClickHanlder(e, 'sat')}>????.</div>
                        <div className={styles.weekendsDay} onClick={(e) => weekendsClickHanlder(e, 'sun')}>????.</div>
                        <div className={styles.weekendsDay} onClick={(e) => weekendsClickHanlder(e, 'sat-sun')}>????. ?? ????.</div>
                    </div>
                </p>
                <p>
                    <div className="schedule">
                        <div
                            className={`scheduleBtn ${isScheduleOpen ? 'scheduleOpened' : ''}`}
                            onClick={() => {setIsScheduleOpen((prev) => !prev); setTimeValid(_ => ({}))}} 
                        >
                            {isScheduleOpen ? '???????????? ???????????????? ??????????????' : '???????????? ?????????????????? ??????????????'}
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
                    <InputMask mask="+9 999 999-99-99" placeholder={transcription[currentLang].inputsPlaceholders.phone} value={phoneNumber} onChange={(e) => inputHandler(e, setPhoneNumber, phoneRegex)}/>
                    {/* <input type="text" value={phoneNumber} onChange={(e) => inputHandler(e, setPhoneNumber, phoneRegex)} placeholder={transcription[currentLang].inputsPlaceholders.phone}/> */}
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
                            <span className="input__file-icon-wrapper"><img className="input__file-icon" src="/img/add.svg" alt="?????????????? ????????" width="25" /></span>
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