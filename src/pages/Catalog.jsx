import React, {useState, useEffect} from 'react';
import MapGL, { Marker } from "react-map-gl";
import { Link } from 'react-router-dom';
import axios from 'axios';

import Category from '../components/Category';
import Toggle from '../components/Toggle/Toggle';
import Select from '../components/Select/Select';
import transcription from '../utils/transcription';
import typeCategories from '../components/shared/typeCategories';
import Pin from '../components/Pin';
import getCategory from '../utils/getCategory';
import Loader from '../components/Loader';
import AppContext from '../context';
import removeDuplicates from '../utils/removeDuplicates';

const TOKEN = 'pk.eyJ1IjoibG9saWsyMCIsImEiOiJja3N6NDhlZ2oycGxnMndvZHVkbGV0MTZ1In0.JkdOOOgJTsu1Sl2qO-5VAA';
// const url = 'https://localhost:44375';
const url = 'https://localhost:44375'

let selectedCategory = [];
let sorted = [];
let lastZoom = 0;
const currentLang = 'ru'

function Catalog() {
    let NAER_RADIUS_CLUSTER = 0.02;
    
    const [isMarkersLoaded, setIsMarkersLoaded] = useState(false)
    const [mapView, setMapView] = useState('company')
    const [clustersMarker, setClustersMarker] = useState([])
    const [isCitiesLoaded, setIsCitiesLoaded] = useState(false)
    const [isLoader, setIsLoader] = useState(false)
    const [citiesMarker, setCitiesMarker] = useState([])
    const [markers, setMarkers] = useState([]);
    const [isToggle, setIsToggle] = useState(true)
    const [markersCopy, setMarkersCopy] = useState([]);
    const [mapCoord, setMapCoord] = useState({
        latitude: 53.893009,
        longitude: 	27.567444,
        zoom: 13,
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

    useEffect(() => {
        if(isCitiesLoaded) return 1;
        getCities()
    })

    const loadClusterMarkers = (cityCluster) => {
        let markers = [...clustersMarker]
        markers = markers.map((m) => {
          return m.markers
        })
        markers = markers.flat()
        
        setMapCoord(prev => ({...prev, latitude: +cityCluster.markers[0].latitude, longitude: +cityCluster.markers[0].longitude, zoom: 13})) 
        setMarkers(markers)
        setClustersMarker([])
        setMapView('company')
    }

    const createClusters = (markers) => {
        let markersCopy = [...markers]
        const clusters = [];
        let cluster = {};
        const currentMarker = 0;
        
        while(markersCopy.length > 0) {
          cluster = {
            latitude: +markersCopy[currentMarker].latitude,
            longitude: +markersCopy[currentMarker].longitude,
            markers: [markersCopy[currentMarker]]
          }
    
          for(let i = 1; i < markersCopy.length; i++) {
            if(
              +markersCopy[i].longitude <= +cluster.longitude + NAER_RADIUS_CLUSTER
                    && +markersCopy[i].longitude >= +cluster.longitude - NAER_RADIUS_CLUSTER
                    && +markersCopy[i].latitude <= +cluster.latitude + NAER_RADIUS_CLUSTER
                    && +markersCopy[i].latitude >= +cluster.latitude - NAER_RADIUS_CLUSTER
            ) {
              cluster.markers.push(markersCopy[i])
            }
          }
    
          for(let marker of cluster.markers) {
            markersCopy = markersCopy.filter(m => m !== marker)
          }
          clusters.push(cluster)
        }
        return clusters
    }

    const createClusterMarker = (cityCluster, id) => {
        let circleSize = 50;
    
        // if(cityCluster.markers.length < 5) {
        //   circleSize = 30;
        // } else if(cityCluster.markers.length < 10) {
        //   circleSize = 40;
        // }
    
        return (
          <Marker 
            key={id} 
            longitude={+cityCluster.longitude} 
            latitude={+cityCluster.latitude} 
            onClick={() => loadClusterMarkers(cityCluster)}
          >
            <div style={{
              width: circleSize,
              cursor: 'pointer',
              height: circleSize,
              background: '#fff',
              borderRadius: '25px',
            }}>
              <Pin count={[1, 2, 3]} color={['#EA5959', '#59EAEA', '#79EA59']} />
              <div style={{
                zIndex: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '35px',
                height: '35px',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 'auto',
                background: '#fff',
                borderRadius: '25px',
                position: 'absolute',
                fontSize: '11px',
                textAlign: 'center',
              }}>
                {cityCluster.markers.length}
              </div>
            </div>
          </Marker>
        )
      }

      const mapClusters = React.useMemo(() => clustersMarker.map(
        (cityCluster, id) => (
          createClusterMarker(cityCluster, id)
        )
      ), [clustersMarker]);

    const onMarkerClick = (id) => {
        const targetCompany = markers.find(m => m.id === id);
        // setCurrentCompany(targetCompany);
        // setIsCompanySelected(true);
    }

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

    // Получение и отрисовка городов
    const createCityMarker = (cityMarker) => {
        return (
        <Marker 
            key={cityMarker.title.length} 
            longitude={+cityMarker.longitude} 
            latitude={+cityMarker.latitude} 
            // onClick={() => getCityCompanies(cityMarker.title)}
        >
            <img style={{ transform: `translate(${-65 / 2}px,${-65}px)`, cursor: 'pointer', userSelect: 'none' }} src="img/build.svg" alt="citi marker" width="65" height="65"/>
        </Marker>
        )
    }

    const mapCities = React.useMemo(() => citiesMarker.map(
        cityMarker => (
            createCityMarker(cityMarker)
        )
    ), [citiesMarker]);

    function getCities() {
        // axios.get(`${url}/api/Company/GetCompanies`, {headers: {'Content-Length': 6000}})
        // axios.get(`https://api.npoint.io/dbbe065fcd8b2f1f3288`)
        axios.get(`${url}/api/Company/GetCities`)
        .then((response) => {
            setCitiesMarker(response.data)
        })
        .catch((error) => {
            console.log(error);
        })
        setIsCitiesLoaded(true)
    }

    const createMarker = (marker, id) => {
        const colors = [];

        for(let category of marker.categoriesId) {
            colors.push(getCategory(+category).color)
        }

        return (
            <Marker 
            key={marker.id} 
            longitude={+marker.longitude} 
            latitude={+marker.latitude} 
            onClick={() => onMarkerClick(marker.id)}
          >
            <div className='markerContainer'
                onMouseOver={(e) => {
                  let parent;
    
                  if(e.target.tagName.toUpperCase() === 'CIRCLE') {
                    parent = e.target.parentNode.parentNode
                  } else if(e.target.tagName.toUpperCase() === 'SVG') {
                    parent = e.target.parentNode
                  } else if(e.target.tagName.toUpperCase() === 'ING') {
                    parent = e.target.parentNode.parentNode
                  } else {
                    parent = document.body;
                  }
                  
                  parent.querySelector('.markerMetaWrapper').classList.add('visible');
                }}
                onMouseOut={(e) => {
                  let parent;
    
                  if(e.target.tagName.toUpperCase() === 'CIRCLE') {
                    parent = e.target.parentNode.parentNode
                  } else if(e.target.tagName.toUpperCase() === 'SVG') {
                    parent = e.target.parentNode
                  } else if(e.target.tagName.toUpperCase() === 'ING') {
                    parent = e.target.parentNode.parentNode
                  } else {
                    parent = document.body;
                  }
                  
                  parent.querySelector('.markerMetaWrapper').classList.remove('visible');
                }}
              >
                <Pin count={[...marker.categoriesId]} color={[...colors]} />
                <div className={`markerMetaWrapper`}>
                  <p style={{whiteSpace: 'nowrap'}}>{marker.title}</p>
                  <ul className="metaCategoriesWrapper">
                    {marker.categoriesId.map((item, idx) => {
                      const categoryMeta = typeCategories(item)
                      let target;
                      categories.forEach(item => {
                        if(categoryMeta === item.type) {
                          target = item;
                        }
                      })
                      return (
                        <li 
                          key={idx}
                          className={`category-item ${target.type}-meta category-item-meta`}
                          style={{
                            backgroundColor: getCategory(+item).color
                          }}
                        >
                            <img src={target.img}
                              width="15"
                              height="15"
                              alt={`${target.type} category`} 
                            />
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <img 
                  src="/img/map-marker.png"
                  alt="marker"
                  style={{position: 'relative'}}
                  width="65"
                  height="65"
                />
              </div>
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
        axios.get(`${url}/api/Company/GetCompanies`)
        // axios.get(`https://api.npoint.io/66155237175de1dd9dc7`)
            .then((response) => {
                setMarkers(response.data)
                setMarkersCopy(response.data)
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

        if(selectedCategory.length <= 0) {
          setMarkers(markersCopy)
        }

        categoryAddStyle(evt)

        const clusters = createClusters(markers)
        setClustersMarker(clusters)
    }

    const mapStateChange = (evt) => {
      if(lastZoom === evt.viewState.zoom) return 1;
        // console.log(Math.ceil(evt.viewState.zoom));
        // console.log(mapCoord.zoom);
        // console.log(mapView);
        
        if(evt.viewState.zoom > 7 && evt.viewState.zoom < 13 && mapView !== 'cluster' && mapView !== 'city') {
          // console.log(3); 
          const clusters = createClusters(markers)
          setClustersMarker(clusters)
    
          setMapView('cluster')
        }
    
        if(evt.viewState.zoom > 13 && mapView === 'cluster') {
          // console.log(4);
          let markers = [...clustersMarker]
          markers = markers.map((m) => {
            return m.markers
          })
          markers = markers.flat()
          
          setClustersMarker([])
          setMapView('company')
    
          setMarkers(markers)
        }
    
        if(evt.viewState.zoom < 13  && mapView === 'cluster') {
          // console.log(5);
    
          switch(Math.ceil(evt.viewState.zoom)) {
            case 13:
              NAER_RADIUS_CLUSTER = 0.01
              break;
            case 12:
              NAER_RADIUS_CLUSTER = 0.02
              break;
            case 11:
              NAER_RADIUS_CLUSTER = 0.03
              break;
            case 10:
              NAER_RADIUS_CLUSTER = 0.04
              break;
            case 9:
              NAER_RADIUS_CLUSTER = 0.06
              break;
            case 8:
              NAER_RADIUS_CLUSTER = 0.1
              break;
          }
    
          // NAER_RADIUS_CLUSTER = 0.06;
          const clusters = createClusters(markers)
          // console.log(clusters);
          setClustersMarker(clusters)
        }

        lastZoom = evt.viewState.zoom;
      } 

    return (
        <AppContext.Provider
            value={{
                setIsLoader
            }}
        >
            {isLoader ? <Loader /> : ""}
            <div className="catalogWrapper">
                <div className="filters">
                    <p className="filtersTitle">Фильтр поиска</p>
                    <div className="filter filter-city">
                        <p className="filterCityText">Город</p>
                        {/* <Select lang={currentLang} setMap={setMapCoord} cities={citiesMarker} setCopy={setMarkersCopy} setMarkers={setMarkers}/> */}
                        {isMarkersLoaded && citiesMarker.length? <Select lang={currentLang} cities={citiesMarker} setMap={setMapCoord} setMarkers={setMarkers} setCopy={setMarkersCopy}/> : ''}
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
                            onViewStateChange={mapStateChange}
                            >
                            {mapView === 'company' ? mapMarkers : mapClusters}
                        </MapGL>
                    </div>
                    <div className="compnayContainer">
                        {markers.length > 0 ? catalogItems : <p style={{textAlign: 'center'}}>Компании отсутствуют</p>}
                    </div>
                </div>
            </div>
        </AppContext.Provider>
    )
}

export default Catalog