import React, {useState, useEffect} from 'react';
import MapGL, { Marker } from "react-map-gl";
import axios from 'axios';

import Category from '../components/Category';

const TOKEN = 'pk.eyJ1IjoibG9saWsyMCIsImEiOiJja3N6NDhlZ2oycGxnMndvZHVkbGV0MTZ1In0.JkdOOOgJTsu1Sl2qO-5VAA';
let selectedItem;

function Catalog() {
    const [isMarkersLoaded, setIsMarkersLoaded] = useState(false)
    const [isSelectedCategory, setIsSelectedCategory] = useState(false)
    const [markers, setMarkers] = useState([]);
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

    const createMarker = (marker) => {
        return (
          <Marker key={marker.id} longitude={marker.longitude} latitude={marker.latitude}>
            {/* <Pin count={2} color={['red', 'black']} /> */}
            <img src="/img/map-marker.png" alt="marker" width="50" height="50"/> {/* onClick={() => onMarkerClick(marker.id)}*/}
          </Marker>
        )
      }
    
    const mapMarkers = React.useMemo(() => markers.map(
        marker => (
            createMarker(marker)
        )
    ), [markers]);

    function getMarkers() {
        // axios.get(`${url}/api/Company/GetCompanies`)
        // axios.get(`https://api.npoint.io/66155237175de1dd9dc7`)
        axios.get(`https://api.npoint.io/bc76838cad204a2dc795`)
            .then((response) => {
                setMarkers(response.data)
            })
            .catch((error) => {
            console.log(error);
            })
        setIsMarkersLoaded(true)
    }

    useEffect(() => {
        if(isMarkersLoaded) return 1;
        getMarkers()
    })

    const appendCategoryStyles = (evt) => {
        let eTarget;
            if(evt.target.tagName === 'IMG') {
                eTarget = evt.target.parentNode;
            } else {
                eTarget = evt.target;
            }

            if(!isSelectedCategory) {
                eTarget.classList.add('selected');
                selectedItem = eTarget;
                setIsSelectedCategory(true)
            }

            if(isSelectedCategory) {
                if(selectedItem === eTarget) {
                    eTarget.classList.remove('selected');
                    setIsSelectedCategory(false)
                } else {
                    selectedItem.classList.remove('selected')
                    eTarget.classList.add('selected')
                    selectedItem = eTarget;
                }
            }
    } 

    const onCategoryClick = (evt, type) => {
        if(isSelectedCategory && selectedItem.classList.contains(type)) {
            appendCategoryStyles(evt);
            setMarkers(markersCopy);
            return 1;
        }

        appendCategoryStyles(evt);

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
        setMarkersCopy(setMarkersCopy)
        setMarkers((prev) => prev.filter(m => m.categoriesId.includes(sortFrom)))
        console.log(markers);
        console.log(sortFrom);
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
                <div className="compnayContainer"></div>
            </div>
        </div>
    )
}

export default Catalog