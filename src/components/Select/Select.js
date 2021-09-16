import React, { useEffect, useState } from 'react';

import styles from './Select.module.scss'

function Select({companies, cityClick}) {
    const [selectedCity, setSelectedCity] = useState('Выберите город')
    const [isSelectOpen, setIsSelectOpen] = useState(false)
    const [changedCompanies, setChangedCompanies] = useState(companies)
    const [isCompanyLoaded, setIsCompanyLoaded] = useState(false)
    
    useEffect(() => {
        if(isCompanyLoaded) return;
        sortCity();
    })

    function sortCity() {
        const cities = []
        changedCompanies.forEach(item => {
            if(cities.find(e => e.city === item.city)) {
                return 1;
            } 
            cities.push(item);
        })
        setChangedCompanies(cities);
        if(changedCompanies.length > 0) {
            setIsCompanyLoaded(true)
        }
    }

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
                {changedCompanies.length > 0  ? <ul className={styles.citiesList}>
                    {changedCompanies.map((company, idx) => {
                        return <li key={idx} className={styles.city} onClick={() => clickHandler(company)}>{company.city}</li>
                    })}
                </ul>
                : <p className={styles.cityEmpty}>Города отсутсвуют</p>}
            </div>
        </div>
    )
}

export default Select