import React, { useEffect, useState } from 'react';
import axios from 'axios';

import transcription from '../../utils/transcription'
import styles from './Select.module.scss'

function Select({setMap, lang, cities, setMarkers, setCopy}) {
    const [selectedCity, setSelectedCity] = useState('')
    const [isSelectOpen, setIsSelectOpen] = useState(false)

    const CityClickHandler = (city) => {
        // axios.get(`${url}/GetCity/${city.cityName}`)
        axios.get(`https://api.npoint.io/3d5795e1a47fe9cb1c83`)
        .then(response => {
            setMarkers(response.data)
            setCopy(response.data)
        })
        .catch(e => console.log(e))

        console.log(city);

        setMap((prev) => {
            return {...prev, latitude: +city.latitude,  longitude: +city.longitude, zoom: 11}
        })

        setSelectedCity(city.cityName)
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
                {cities.length  ? <ul className={styles.citiesList}>
                    {cities.map((city, idx) => {
                        return (
                            <li 
                                key={idx} 
                                className={styles.city} 
                                onClick={() => CityClickHandler(city)}
                            >{city.cityName}</li>
                        )
                    })}
                </ul>
                : <p className={styles.cityEmpty}>{transcription[lang].selectCitiesEmpty}</p>}
            </div>
        </div>
    )
}

export default Select