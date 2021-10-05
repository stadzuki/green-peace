import React from "react";
import axios from "axios";

import Schedule from "../components/Schedule/Shedule";
import CardCompany from "../components/CardCompany/CardCompany";

import removeDuplicates from "../utils/removeDuplicates";

const url = 'https://e4ee-88-232-171-215.ngrok.io';
const timeRegex = /^[0-9]{2}[0-9]?\:[0-9]{2}$/;

let validCompany = {};

function Admin() {
    const [companies, setCompanies] = React.useState([])
    const [companyIndex, setCompanyIndex] = React.useState(0)
    const [currentCompany, setCurrentCompany] = React.useState({})
    const [isScheduleOpen, setIsScheduleOpen] = React.useState(false)
    const [schedule, setSchedule] = React.useState([
        {id: 0, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
        {id: 1, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
        {id: 2, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
        {id: 3, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
        {id: 4, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
        {id: 5, isToggle: false, firstFieldValue: '', secondFieldValue: ''},
        {id: 6, isToggle: false, firstFieldValue: '', secondFieldValue: ''}
    ])
    
    let tryLoadCompanies = 0;

    const scheduleItems = [
        {name: 'Понедельник', idx: 0},
        {name: 'Вторник', idx: 1},
        {name: 'Среда', idx: 2},
        {name: 'Четверг', idx: 3},
        {name: 'Пятница', idx: 4},
        {name: 'Суббота', idx: 5},
        {name: 'Воскресенье', idx: 6}
    ]

    const categoryListString = '1 - бумага, 2 - стекло, 3 - пластик,\
        \n4 - металл 5 - одежда 6 - иное,\
        \n7 - опасные отходы, 8 - батарейки, 9 - лампочки,\
        \n10 - бытовая техника, 11 - тетра пак, 12 - крышечки,\
        \n13 - шины\n\n';

    React.useEffect(() => {
        if(companies.length <= 0 && tryLoadCompanies <= 5) {
            if(tryLoadCompanies === 5) return alert('Не удалось загрузить данные')
            getComanies()
            tryLoadCompanies++;
        }
    })

    const scheduleToggleClick = (idx) => {
        const data = schedule[idx]
        data.isToggle = !data.isToggle;
        setSchedule((prev) => removeDuplicates([...prev, data]))
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

    const getWorkTime = () => {
        // if(isAllTime) {//without weekends
        //     return '24/7'
        // } else 
        if(isScheduleFullFileld()) {//with weekends
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
        }
    }

    function saveSchedule() {
        if(isScheduleClear()) {
            alert('Время рабочего дня заполнено некорректно');
            return 1;
        }

        setIsScheduleOpen(false)
        setCurrentCompany(prev => ({
            ...prev,
            workTime: getWorkTime()
        }))
    }

    function schedulePrepare(schedule, scheduleSetter) {
        const schedules = schedule.split('+');
        const forScheduleSetter = [];

        for(let i = 0; i < schedules.length; i++) {
            const workTime = schedules[i].split('-') 

            forScheduleSetter.push({
                id: i,
                isToggle: workTime[0] === 'none' ? false : true,
                firstFieldValue: workTime[0] === 'none' ? '' : workTime[0],
                secondFieldValue: workTime[1] === 'none' ? '' : workTime[1],
            })
        }

        scheduleSetter(forScheduleSetter);
    }

    function changeInfo(message, key) {
        const modal = prompt(message, currentCompany[key])
        if(modal !== null && modal !== currentCompany[key]) {
            if(key === 'categoriesId') {
                const categories = modal;
                if(categories.search(/^([\d]{1}\,?\s?)+$/) !== -1) {
                    setCurrentCompany(prev => ({
                        ...prev,
                        [key]: modal.split(',')
                    }))
                } else {
                    alert('Категории указаны некорректно')
                }
                return 1;
            }

            setCurrentCompany(prev => ({
                ...prev,
                [key]: modal
            }))
        }
    }

    function uploadPhotoHandler(e) {
        let file = e.target.files[0];
        if(file.type !== "image/jpeg") {
            return alert('Изображение должно быть .jpeg формата')
        }
        let reader = new FileReader();
        reader.onloadend = function() {
            setCurrentCompany((prev) => ({
                ...prev,
                imageUrl: reader.result.slice(23)
            }))
        }
        reader.readAsDataURL(file);
    }

    function getComanies() {
        // axios.get(`https://api.npoint.io/3d5795e1a47fe9cb1c83`)
        axios.get(`${url}/api/Company/GetCompaniesInAdminPanel`)
            .then((response) => {
                setCurrentCompany(response.data[0]);
                setCompanies(response.data);
                schedulePrepare(response.data[0].workTime, setSchedule)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function nextCard() {
        if(companyIndex > companies.length - 1) return 1;
        setCompanyIndex((prev) => prev += 1)
        setCurrentCompany(companies[companyIndex])
        schedulePrepare(companies[companyIndex].workTime, setSchedule)
    }

    function acceptCompany() {
        axios.post(`${url}/api/Company/ApproveCompany/${currentCompany.id}`)
            .then((resp) => {
                console.log(resp);
            })
            .catch((error) => {
                console.log(error);
            })

        axios.put(`${url}/api/Company/UpdateCompany`, currentCompany)

        nextCard();
    }

    function dismissCompany() {
        validCompany = {id: companies[companyIndex].id}

        axios.post(`${url}/api/Company/DeclineCompany/${currentCompany.id}`)
            .then((resp) => {
                console.log(resp);
            })
            .catch((error) => {
                console.log(error);
            })

        nextCard();
    }

    return (
        <div className="adminPage">
            <div>
                <h3>Список команий на модерацию:</h3>
                {companies.length > 0 && companies.length - 1 >= companyIndex 
                    ? <div className="compayHandle">
                        {companies.length > 0 ? <CardCompany company={currentCompany} isCommentVisible={false}/> : ''}
                        <div className="btnWrapper">
                            <div className="btnControls">
                                <div className="adminBtn adminBtnControls" 
                                    onClick={() => changeInfo('Изменить название', 'title')}
                                >
                                    Изменить название
                                </div>
                                <div className="adminBtn adminBtnControls">
                                    <input id="adminInputFile" className="input__file" type="file" accept="image/jpeg" onChange={uploadPhotoHandler}/>
                                    <label htmlFor="adminInputFile">Изменить фото (.JPEG)</label>
                                </div>
                                <div className="adminBtn adminBtnControls" 
                                    onClick={() => changeInfo('Изменить город', 'city')}
                                >
                                    Изменить город
                                </div>
                                <div className="adminBtn adminBtnControls" 
                                    onClick={() => changeInfo('Изменить адрес', 'address')}
                                >
                                    Изменить адрес
                                </div>
                                <div className="adminBtn adminBtnControls" 
                                    onClick={() => changeInfo('Изменить категории, укажите номера через запятую.\nДоступные категории:\n\n' + categoryListString, 'categoriesId')}
                                >
                                    Изменить категории
                                </div>
                                <div className="adminBtn adminBtnControls" 
                                    onClick={() => changeInfo('Изменить описание', 'description')}
                                >
                                    Изменить описание
                                </div>
                                <div className="adminBtn adminBtnControls" 
                                    onClick={() => changeInfo('Изменить перерыв', 'coffeTime')}
                                >
                                    Изменить перерыв
                                </div>
                                <div className="adminBtn adminBtnControls" 
                                    onClick={() => changeInfo('Изменить телефон', 'phoneNumber')}
                                >
                                    Изменить телефон
                                </div>
                                <div className="adminBtn adminBtnControls" 
                                    onClick={() => changeInfo('Изменить сайт', 'webSiteUrl')}
                                >
                                    Изменить сайт
                                </div>
                                
                            </div>
                            <div className="btnAdding">
                                <div className="adminBtn acceptCompany" onClick={acceptCompany}>Принять</div>
                                <div className="adminBtn dismissCompany" onClick={dismissCompany}>Отклонить</div>
                            </div>
                        </div>
                    </div>
                    : ''
                }
            </div>
            <div className="schedule" style={{width: 500, marginRight: '35%'}}>
                <div
                    className={`scheduleBtn ${isScheduleOpen ? 'scheduleOpened' : ''}`}
                    onClick={() => setIsScheduleOpen((prev) => !prev)}
                >
                    {isScheduleOpen ? 'Скрыть варианты графика' : 'Больше вариантов графика'}
                </div>
                <form>
                    {isScheduleOpen 
                        ? <div className="scheduleContent">
                            {scheduleItems.map((item, idx) => {
                                return (
                                    <Schedule 
                                        key={idx}
                                        scheduleToggleClick={scheduleToggleClick}
                                        schedule={schedule[idx]}
                                        lang={'ru'}
                                        weekday={item.name}
                                        scheduleChangeHandler={scheduleChangeHandler}
                                        idx={idx}
                                    />
                                )
                            })}
                            <button onClick={saveSchedule}>Сохранить</button>
                        </div>
                        : ''
                    }
                </form>
            </div>
        </div>
    )
}

export default Admin;