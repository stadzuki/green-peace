import React, { useState } from 'react';

import styles from './Select.module.scss'

const cities2 = [
    'Москва',
    'Сочи',
    'Минск',
    'Гродно',
    'Запарожье'
]

//Принимать название городов -> добавлять их в список li
//Принимать функцию которая отвечает за назатие по выбранному городу

//Принимаем company и отправляем этот объект в функцию, которая нам пришла

function Select({companies, cityClick}) {
    const [selectedCity, setSelectedCity] = useState('Выберите город')
    const [isSelectOpen, setIsSelectOpen] = useState(false)

    const clickHandler = (company) => {
        setSelectedCity(company.city)
        cityClick(company)
    }

    return (
        <div className={styles.selectWrapper}>
            <div className={styles.selectionTitle} onClick={() => setIsSelectOpen((prev) => !prev)}>
                <p className={styles.outputSelection}>{selectedCity}</p>
                <svg className={isSelectOpen ? styles.rotateArrow : ''}
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="none"
                    viewBox="0 0 15 15"
                    >
                    <g clipPath="url(#clip0)">
                        <path
                            fill="#333"
                            d="M7.496 11.415a.325.325 0 01-.231-.095L.09 4.146a.326.326 0 01.461-.46l6.944 6.942 6.942-6.944a.326.326 0 01.47.454l-.008.008-7.174 7.173a.326.326 0 01-.23.096z"
                        ></path>
                    </g>
                </svg>
            </div>
            <div className={`${isSelectOpen ? styles.visible : ''} ${styles.selectList}`}>
                <ul className={styles.citiesList}>
                    {cities2.map((city, idx) => {
                        return <li key={idx} className={styles.city}>{city}</li>
                    })}
                    {/* ВОТ ТАК НАДО СДЕЛАТЬ
                    {companies.map((company, idx) => {
                        return <li key={idx} className={styles.city} onClick={() => clickHandler(company)}>{company.city}</li>
                    })} */}
                </ul>
            </div>
        </div>
    )
}

export default Select