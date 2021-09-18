import React, {useState, useEffect} from 'react';
import MapGL, { Marker } from "react-map-gl";
import { Link } from 'react-router-dom';
import axios from 'axios';

import Category from '../components/Category';
import Toggle from '../components/Toggle/Toggle';
import Select from '../components/Select/Select';
import transcription from '../utils/transcription';
import removeDuplicates from '../utils/removeDuplicates';

const TOKEN = 'pk.eyJ1IjoibG9saWsyMCIsImEiOiJja3N6NDhlZ2oycGxnMndvZHVkbGV0MTZ1In0.JkdOOOgJTsu1Sl2qO-5VAA';
const url = 'https://api.npoint.io/66155237175de1dd9dc7';

let selectedCategory = [];
let sorted = [];

const currentLang = 'ru'

function Catalog() {
    const [isMarkersLoaded, setIsMarkersLoaded] = useState(false)
    const [readonlyMarkers, setReadonlyMarkers] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [isToggle, setIsToggle] = useState(true)
    const [markersCopy, setMarkersCopy] = useState([]);
    const [mapCoord, setMapCoord] = useState({
        latitude: 53.893009,
        longitude: 	27.567444,
        zoom: 8,
        bearing: 0,
        pitch: 0,
    });

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
    
    const createMarker = (marker, id) => {
        //{/* onClick={() => onMarkerClick(marker.id)}*/}
        return (
          <Marker key={id} longitude={+marker.longitude} latitude={+marker.latitude}>
            <img src="/img/map-marker.png" alt="marker" width="50" height="50"/> 
          </Marker>
        )
    }

    const createCatalogItem = ({id, title, city, categoriesId, imageUrl}) => {
        return (
            <div className="catalogCompanyCard" key={id}>
                <div className="catalogImageWrapper">
                    <img src={"data:image/jpeg;base64," + imageUrl} alt="company photo"/>
                </div>
                <div className="catalogCompanyContent">
                    <p className="companyCardTitle">{title}
                        <span className="companyCardCity"> {city}</span>
                    </p>
                    <p className="compnayTake">Мы принимаем:
                        <span className="companyCardCategories"> {categoriesToString(categoriesId)}</span>
                    </p>
                </div>
            </div>
        )
    }
    
    const mapMarkers = React.useMemo(() => markers.map(
        (marker, idx) => (
            createMarker(marker, idx)
        )
    ), [markers]);

    const catalogItems = React.useMemo(() => markers.map(
        marker => (
            createCatalogItem(marker)
        )
    ), [markers]);

    function getMarkers() {
        // axios.get(`${url}/api/Company/GetCompanies`)
        axios.get(`https://api.npoint.io/66155237175de1dd9dc7`)
            .then((response) => {
                setMarkers(response.data)
                setMarkersCopy(response.data)
                setReadonlyMarkers(response.data)
                setIsMarkersLoaded(true)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        if(isMarkersLoaded) return 1;
        getMarkers()
    })

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

    const categoryAddStyle = (evt) => {
        if(evt.target.tagName === 'IMG') {
            evt.target.parentNode.classList.toggle('selected');
        } else {
            evt.target.classList.toggle('selected');
        }
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
                sortFrom = 0;
                break;
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
        <div className="catalogWrapper">
            <div className="filters">
                <p className="filtersTitle">Фильтр поиска</p>
                <div className="filter filter-city">
                    <p className="filterCityText">Город</p>
                    {isMarkersLoaded ? <Select lang={currentLang} readonlyMarkers={readonlyMarkers} setMap={setMapCoord} setMarkers={setMarkers} setCopy={setMarkersCopy}/> : ''}
                </div>
                <div className="filter filter-type">
                    <p>Категории</p>
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
                <Toggle lang={currentLang} isToggle={isToggle} toggleClick={clearCategoriesFilter}/>
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
                    {markers.length > 0 ? catalogItems : <p style={{textAlign: 'center'}}>Компании отсутствуют</p>}
                </div>
            </div>
        </div>
    )
}

export default Catalog