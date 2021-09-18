import React, { useEffect, useState } from 'react';
import AppContext from '../../context';
import removeDuplicates from '../../utils/removeDuplicates';

import Toggle from '../Toggle/Toggle';
import Category from '../Category';
import Place from '../Place';

import styles from './Card.module.scss';
import transcription from '../../utils/transcription';
import Select from '../Select/Select';

import categories from '../shared/categories'
import CreateCard from '../CreateCard/CreateCard';

let selectedCategory = [];
let addedCategory = [];
let sorted = [];

// при наведении на маркер выводить мета инфу

// const fields = [
    //     {name: 'city', title: transcription[currentLang].inputsTitles.city, value: city, setter: setCity, placeholder: transcription[currentLang].inputsPlaceholders.city},
    //     {name: 'adress', title: transcription[currentLang].inputsTitles.adress, value: adress, setter: setAdress, placeholder: transcription[currentLang].inputsPlaceholders.adress},
    //     {name: 'namePlace', title: transcription[currentLang].inputsTitles.name, value: namePlace, setter: setNamePlace, placeholder: transcription[currentLang].inputsPlaceholders.name},
    //     {name: 'phoneNumber', title: transcription[currentLang].inputsTitles.phone, value: phoneNumber, setter: setPhoneNumber, placeholder: transcription[currentLang].inputsPlaceholders.phone},
    //     {name: 'website', title: transcription[currentLang].inputsTitles.webSite, value: website, setter: setWebsite, placeholder: transcription[currentLang].inputsPlaceholders.webSite},
    //     {name: 'descriptionPlace', title: transcription[currentLang].inputsTitles.description, value: descriptionPlace, setter: setDescriptionPlace, placeholder: transcription[currentLang].inputsPlaceholders.description},
    // ]

function Card() {
    const [category, setCategory] = useState([])
    const [isSelectedCategory, setIsSelectedCategory] = useState(false)
    const [isMarkersLoaded, setIsMarkersLoaded] = useState(false)
    const [isToggle, setIsToggle] = useState(true)
    const {
        target,
        setMarkers,
        markers,
        currentLang,
        setMapCoord,
        markersCopy,
        setMarkersCopy,
        readonlyMarkers,
    } = React.useContext(AppContext)


    useEffect(() => {
        if(isMarkersLoaded) return 1;
        if(markers.length > 0) {
            setIsMarkersLoaded(true)
        }
    })

    useEffect(() => {
        if(target) {
            selectedCategory = []
            sorted = []
            addedCategory = []
        }
    }, [target])

    const categoryAddStyle = (evt) => {
        if(evt.target.tagName === 'IMG') {
            evt.target.parentNode.classList.toggle('selected');
        } else {
            evt.target.classList.toggle('selected');
        }
    }

    const clearCategoriesFilter = () => {
        const toggleElem = document.getElementById('toggle');
        document.querySelectorAll('.category-item').forEach(item => item.classList.remove('selected'))

        setMarkers(markersCopy)
        sorted = []
        selectedCategory = []

        setIsToggle((prev) => {
            if(prev) {
                toggleElem.setAttribute("checked", "checked")
            } else {
                toggleElem.removeAttribute("checked")
            }

            return !prev
        })
    }

    const onCategoryClick = (evt, type) => {     
        let sortFrom;
        //????
        switch(type) {
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
                sortFrom = 0;
                break;
        }

        //add to categories group
        if(target) {
            if(addedCategory.includes(sortFrom)) {
                addedCategory= addedCategory.filter(e => e !== sortFrom)
            } else {
                addedCategory.push(sortFrom)
            }
            categoryAddStyle(evt)
            setCategory(addedCategory)
            return 1;
        }

        if(selectedCategory.includes(sortFrom)) {
            selectedCategory = selectedCategory.filter(e => e !== sortFrom)

            if(isToggle) {
                let sort = [...markersCopy]
                for(let i = 0; i < selectedCategory.length; i++) {
                    sort = sort.filter(e => e.categoriesId.includes(selectedCategory[i]))
                }
                setMarkers(sort)
            } else {
                let sort = [...markers]
                let newSort = [];
                for(let i = 0; i < selectedCategory.length; i++) {
                    sort = sort.filter(e => e.categoriesId.includes(selectedCategory[i]))
                    newSort = removeDuplicates([...newSort, ...sort])
                }
                sorted = newSort;
                setMarkers(newSort)

                if(selectedCategory.length <= 0) {
                    sorted = []
                }
            }
            
        } else {
            if(isToggle) {
                setMarkers(prev => prev.filter(e => e.categoriesId.includes(sortFrom)))
            } else {
                let newSort = [...markersCopy]
                newSort = newSort.filter(e => e.categoriesId.includes(sortFrom))

                sorted = removeDuplicates([...sorted, ...newSort])

                setMarkers(sorted)
            }
            
            selectedCategory.push(sortFrom)
        }

        categoryAddStyle(evt)
    }

    return (
        <div className={`${styles.cardContainer} ${styles.categoryCard} ${target ? styles.editContainer : ''}`}>
            <div className={styles.cardCategories}>
                {!target && isMarkersLoaded ? <Select lang={currentLang} readonlyMarkers={readonlyMarkers} setMap={setMapCoord} setMarkers={setMarkers} setCopy={setMarkersCopy}/> : ''}
                <p className={styles.categoriesTitle}>
                    {!target ? transcription[currentLang].cardCategoryTitle : transcription[currentLang].createCompanyTitle}
                </p>
                <ul className={styles.categoriesList}>
                    {categories.map((category, idx) => {
                        return <Category 
                                    key={idx} 
                                    type={category.type} 
                                    img={category.img} 
                                    onCategoryClick={(e) => onCategoryClick(e, category.type)}
                                />
                    })}
                </ul>
                {!target ? <Toggle lang={currentLang} isToggle={isToggle} toggleClick={clearCategoriesFilter}/> : ''}
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
                : ''
            }
            { target ? <CreateCard category={category} setCategory={setCategory}/> : '' }
        </div>
    )
}

export default Card