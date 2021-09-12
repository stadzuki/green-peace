import React, {useState, useEffect} from 'react';
import MapGL, { Marker } from "react-map-gl";
import { Link } from 'react-router-dom';
import axios from 'axios';

import Category from '../components/Category';
import transcription from '../transcription';

const TOKEN = 'pk.eyJ1IjoibG9saWsyMCIsImEiOiJja3N6NDhlZ2oycGxnMndvZHVkbGV0MTZ1In0.JkdOOOgJTsu1Sl2qO-5VAA';
const targetCategories = [];
const url = 'http://e6bd-188-119-45-172.ngrok.io';

let selectedCategory = [];
let mass = [];

function Catalog() {
    const [isMarkersLoaded, setIsMarkersLoaded] = useState(false)
    const [sortingMarkers, setSortingMarkers] = useState([])
    const [markers, setMarkers] = useState([]);
    const [markersCopy, setMarkersCopy] = useState([]);
    const [mapCoord, setMapCoord] = useState({
        latitude: 53.893009,
        longitude: 	27.567444,
        zoom: 8,
        bearing: 0,
        pitch: 0,
    });

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

    const categoriesToString = (categories) => {
        let outStr = '';
        for(let category of categories) {
            switch(category) {
                case 1:
                    outStr += ' бумага,'
                    break;
                case 2:
                    outStr += ' стекло,'
                    break;
                case 3:
                    outStr += ' пластик,'
                    break;
                case 4:
                    outStr += ' металл,'
                    break;
                case 5:
                    outStr += ' одежда,'
                    break;
                case 6:
                    outStr += ' иное,'
                    break;
                case 7:
                    outStr += ' опасные отходы,'
                    break;
                case 8:
                    outStr += ' батарейки,'
                    break;
                case 9:
                    outStr += ' лампочки,'
                    break;
                case 10:
                    outStr += ' бытовая техника,'
                    break;
                case 11:
                    outStr += ' тетра пак,'
                    break;
                case 12:
                    outStr += ' крышечки,'
                    break;
                case 13:
                    outStr += ' шины'
                    break;
            }
        }

        if(outStr.endsWith(',')) {
            outStr = outStr.slice(0, outStr.length - 1)
        }

        return outStr;
    }

    const createMarker = (marker) => {
        return (
          <Marker key={marker.id} longitude={marker.longitude} latitude={marker.latitude}>
            {/* <Pin count={2} color={['red', 'black']} /> */}
            <img src="/img/map-marker.png" alt="marker" width="50" height="50"/> {/* onClick={() => onMarkerClick(marker.id)}*/}
          </Marker>
        )
    }

    const createCatalogItem = ({title, city, categoriesId}) => {
        return (
            <div className="catalogCompanyCard">
                <p className="companyCardTitle">{title}
                    <span className="companyCardCity"> {city}</span>
                </p>
                <p className="compnayTake">Мы принимаем:
                    <span className="companyCardCategories"> {categoriesToString(categoriesId)}</span>
                </p>
            </div>
        )
    }
    
    const mapMarkers = React.useMemo(() => markers.map(
        marker => (
            createMarker(marker)
        )
    ), [markers]);

    const catalogItems = React.useMemo(() => markers.map(
        marker => (
            createCatalogItem(marker)
        )
    ), [markers]);

    function getMarkers() {
        axios.get(`${url}/api/Company/GetCompanies`)
            .then((response) => {
                setMarkers(response.data)
            })
            .catch((error) => {
            console.log(error);
            })
        setIsMarkersLoaded(true)
        console.log(markers);
    }

    useEffect(() => {
        if(isMarkersLoaded) return 1;
        getMarkers()
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

    const onCategoryClick = (evt, type) => {     
        let sortFrom;

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
                sortFrom = 1;
                break;
        }

        if(selectedCategory.includes(type)) {
            setMarkers(prev => prev.filter(e => !e.categoriesId.includes(sortFrom)))
        } else if(selectedCategory.length > 0) {
            let sorted = [...markers];
            let newSort = [];

            newSort = [...markersCopy]
            newSort.filter(m => m.categoriesId.includes(sortFrom))
            newSort = [...sorted, ...newSort.filter(m => m.categoriesId.includes(sortFrom))]
            sorted = [...newSort]
            sorted = removeDuplicates(sorted)
            
            setMarkers(sorted)
        }


        if(selectedCategory.length <= 0) {
            setMarkersCopy(markers)
            setMarkers((prev) => prev.filter(m => m.categoriesId.includes(sortFrom)))
        }

        appendCategory(evt, type);
    }

    return (
        <div className="catalogWrapper">
            <div className="filters">
                <p className="filtersTitle">Фильтр поиска</p>
                <div className="filter filter-city">
                    <p>Город</p>
                    <small>Реализовать компонент селектора городов</small>
                </div>
                <div className="filter filter-type">
                    <p>Категория</p>
                    <ul className="filterTypes">
                        {categories.map((category, idx) => {
                            return <Category 
                                        key={idx} 
                                        type={category.type} 
                                        img={category.img}
                                        onCategoryClick={(e) => onCategoryClick(e, category.type)}
                                    />
                        })}
                    </ul>
                </div>
                <Link to="/" className="toHome">На главную</Link>
            </div>
            <div className="catalogView">
                <div className="mapContainer">
                    <MapGL
                        {...mapCoord}
                        width="100vw"
                        height="100vh"
                        mapStyle="mapbox://styles/babichdima/cksj6yk2baq5217pja2fqa5r8"
                        onViewportChange={setMapCoord}
                        mapboxApiAccessToken={TOKEN}
                        >
                        {mapMarkers}
                    </MapGL>
                </div>
                <div className="compnayContainer">
                    {catalogItems}
                </div>
            </div>
        </div>
    )
}

export default Catalog