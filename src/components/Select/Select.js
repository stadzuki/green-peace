import React, { useEffect, useState } from 'react';

import transcription from '../../utils/transcription'
import styles from './Select.module.scss'

//Берем все города без повторений и пляшем от выбранного города
// то есть берем все маркеры и делаем поиск по городам и сохраняем только те маркеры которые соответствую городу
let copyMarkers = [];
function Select({setMap, setCity, setMarkers, setCopy, readonlyMarkers, lang}) {
    const [selectedCity, setSelectedCity] = useState('')
    const [isSelectOpen, setIsSelectOpen] = useState(false)
    const [cities, setCities] = useState([])
    const [isCompanyLoaded, setIsCompanyLoaded] = useState(false)
    
    useEffect(() => {
        if(isCompanyLoaded) return 1;
        if(readonlyMarkers.length > 0) {
            sortCity();
        }
    })

    function sortCity() {
        const citiesArr = [...readonlyMarkers]
        copyMarkers = [...readonlyMarkers]
        const catchCities = []
        
        citiesArr.forEach(item => {
            if(catchCities.find(e => e.toLowerCase() === item.city.toLowerCase())) {
                return 1;
            }
            catchCities.push(item.city);
        })
        
        setCities(catchCities);
        setIsCompanyLoaded(true)
    }

    const clickHandler = (city) => {
        const company = [...copyMarkers.filter(c => c.city === city)]
        
        setMap((prev) => {
            return {...prev, latitude: +company[0].latitude,  longitude: +company[0].longitude, zoom: 11}
        })
        setMarkers(company)
        setCopy(company)

        setSelectedCity(city)
        if(setCity !== undefined) {
            setCity(city)
        }
        setIsSelectOpen(false)
    }

    return (
        <div className={styles.selectWrapper}>
            <div className={styles.selectionTitle} onClick={() => setIsSelectOpen((prev) => !prev)}>
                <p className={styles.outputSelection}>{selectedCity === '' ? transcription[lang].selectPlaceholder : selectedCity}</p>
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
                {cities.length > 0  ? <ul className={styles.citiesList}>
                    {cities.map((city, idx) => {
                        return <li key={idx} className={styles.city} onClick={() => clickHandler(city)}>{city}</li>
                    })}
                </ul>
                : <p className={styles.cityEmpty}>{transcription[lang].selectCitiesEmpty}</p>}
            </div>
        </div>
    )
}

export default Select