import React, { useEffect, useReducer, useState } from "react";
import AppContext from "./context";

import MapGL, { Marker } from "react-map-gl";

import Header from "./components/Header";
import Login from "./components/Login/Login";
import Card from "./components/Card/Card";
import Loader from "./components/Loader";
import MarkerCreator from "./components/MarkerCreator";
import CardCompany from "./components/CardCompany/CardCompany"

import jwtDecode from "jwt-decode";
import axios from "axios";
import categories from "./components/shared/categories";
import typeCategories from "./components/shared/typeCategories";

import Pin from "./components/Pin";
import getCategory from "./utils/getCategory";
import Popup from "./components/Popup";

const TOKEN = 'pk.eyJ1IjoibG9saWsyMCIsImEiOiJja3N6NDhlZ2oycGxnMndvZHVkbGV0MTZ1In0.JkdOOOgJTsu1Sl2qO-5VAA';

const MARKER_SIZE = 65;

// const url = 'https://localhost:44375'
const url = 'https://localhost:44375'

//
//
//
//           ПЕРЕПИСАТЬ TOKEN В USE EFFECT
//
//


let lastZoom = 0;

function App() {
  let NAER_RADIUS_CLUSTER = 0.02;
  const mapRef = React.useRef()

  

  //transcription
  const [currentLang, setCurrentLang] = useState(() => {
    switch(window.navigator.language) {
      case 'ru':
        return 'ru'
      case 'en':
        return 'en'
      default:
        return 'ua'
    }
  });

  //Loader
  const [isLoader, setIsLoader] = useState(false);

  const [popup, setPopup] = useState(false)
  //Map
  const [mapCoord, setMapCoord] = useState({
    latitude: 53.893009,
    longitude: 	27.567444,
    zoom: 13,
    bearing: 0,
    pitch: 0,
  });
  const [mapView, setMapView] = useState('city')
  // const [isGettedLocate, setIsGettedLocate] = useState(false);

  //Auth
  const [token, setToken] = useState("");
  const [loginMethod, setLoginMethod] = React.useState("");

  //User
  const [user, setUser] = useState({});
  const [isAuthorize, setIsAuthorize] = useState(false);
  // const [currentPos, setCurrentPos] = useState({})

  //Marker
  const [readonlyMarkers, setReadonlyMarkers] = useState([])
  const [isMarkersLoaded, setIsMarkersLoaded] = useState(false);
  const [isMarkerCreate, setIsMarkerCreate] = useState(false)
  const [target, setTarget] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [newMarker, setNewMarker] = useState(false)
  const [markersCopy, setMarkersCopy] = useState([]);

  //Cities
  const [citiesMarker, setCitiesMarker] = useState([])
  const [isCitiesLoaded, setIsCitiesLoaded] = useState(false)
  const [initCity, setInitCity] = useState('')

  //
  const [clustersMarker, setClustersMarker] = useState([])

  //Company
  const [isCompanySelected, setIsCompanySelected] = useState(false)
  const [currentCompany, setCurrentCompany] = useState({})

  let userDublicate = {}

  // useEffect(() => {
  //     const map = mapRef.current.getMap()
  //     const visibleFeatures = map.queryRenderedFeatures()
  //     console.log('visible features: ', visibleFeatures)
  // }, [mapRef, mapCoord])

  // console.log(target);

  //Токен
  useEffect(() => {

    if (!token) {
      setIsLoader(true)
      const tokenJWT = JSON.parse(localStorage.getItem("token"));

      if (
        tokenJWT !== null &&
        isAuthorize === false &&
        tokenJWT !== undefined
      ) {
        const payloads = jwtDecode(tokenJWT);

        axios.get(`${url}/Users/${payloads.id}`, {
            headers: { Authorization: `${tokenJWT}` },
          })
          .then((response) => {
            if(response.status === 204) {
              setIsAuthorize(true);
              return;
            }

            userDublicate = {
              id: response.data.id,
              email: response.data.email,
              login: response.data.name,
              icon: response.data.avatarUrl,
            }

            setUser({
              id: response.data.id,
              email: response.data.email,
              login: response.data.name,
              icon: response.data.avatarUrl,
            });

            setIsAuthorize(true);
            // setIsLoader(false);
          })
          .catch((error) => {
            console.error(error);
            console.warn('can not load token')
            setIsLoader(false)
        });

        setToken(tokenJWT);
      }
    }

    // if (!isGettedLocate) {
    //   getLocation();
    // }
  }, [token]);

  //Загрузка городов
  useEffect(() => {
    if(isCitiesLoaded) return 1;
    getCities()
  });

  // Получение и отрисовка маркеров
  const createMarker = (marker) => {
    const colors = [];

    if(isMarkerCreate !== 'INIT') {
      for(let category of marker.categoriesId) {
        colors.push(getCategory(+category).color)
      }
    }

    return (
      <Marker 
        key={marker.id} 
        longitude={+marker.longitude} 
        latitude={+marker.latitude} 
        offsetLeft={0}
        offsetTop={0}
        onClick={() => onMarkerClick(marker.id)}
        draggable={isMarkerCreate}
        onDrag={(e) => setMarkers([{id: 0, latitude: e.lngLat[1], longitude: e.lngLat[0]}])}
      >
        {isMarkerCreate !== 'INIT' 
          ? <div className='markersssContainer'
              style={{ transform: `translate(${-MARKER_SIZE / 2}px,${-MARKER_SIZE}px)`, position: 'absolute' }}
              onMouseOver={(e) => {
                let parent;

                if(e.target.tagName.toUpperCase() === 'CIRCLE') {
                  parent = e.target.parentNode.parentNode
                } else if(e.target.tagName.toUpperCase() === 'SVG') {
                  parent = e.target.parentNode
                } else if(e.target.tagName.toUpperCase() === 'IMG') {
                  parent = e.target.parentNode.parentNode
                } else {
                  parent = document.body;
                }
                
                if(parent) {
                  parent?.querySelector('.markerMetaWrapper').classList.add('visible');
                }
              }}
              onMouseOut={(e) => {
                let parent;

                if(e.target.tagName.toUpperCase() === 'CIRCLE') {
                  parent = e.target.parentNode.parentNode
                } else if(e.target.tagName.toUpperCase() === 'SVG') {
                  parent = e.target.parentNode
                } else if(e.target.tagName.toUpperCase() === 'IMG') {
                  parent = e.target.parentNode.parentNode
                } else {
                  parent = document.body;
                }
                
                if(parent) {
                  parent?.querySelector('.markerMetaWrapper').classList.remove('visible');
                }
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
              src="/img/map-marker.webp"
              alt="marker"
              style={{position: 'relative'}}
              width="65"
              height="65"
            />
          </div>
          : 
            <div className='markersContainer'
              style={{ transform: `translate(${-MARKER_SIZE / 2}px,${-MARKER_SIZE}px)`, position: 'absolute' }}
            >
              <img 
                style={{ pointerEvents: 'none', position: 'relative' }}
                // style={{ transform: `translate(${-MARKER_SIZE / 2}px,${-MARKER_SIZE}px)`, pointerEvents: 'none' }}
                src="/img/map-marker.webp"
                alt="marker"
                width="65"
                height="65"
              />
            </div>
        }
        
      </Marker>
    )
  }

  const mapMarkers = React.useMemo(() => markers.map(
    marker => (
        createMarker(marker)
    )
  ), [markers]);

  const getCityCompanies = (city) => {
    setIsLoader(true)
    setInitCity(city.title)
    
    axios.get(`${url}/api/Company/GetCompanies?city=${city.title}`)
    .then(response => {
      setMapCoord((prev) => ({...prev, latitude: +response.data[0].latitude, longitude: +response.data[0].longitude, zoom: 13}))
      console.log(response.data[0]);
      setMarkers(response.data)
      setMarkersCopy(response.data)
      
      setTimeout(() => {
        setMapView('company');
      })
      setIsLoader(false);
    })
    .catch(error => {
      console.error(error);
      console.warn('can not load city companies');

      setIsLoader(false);
    })
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

  const loadClusterMarkers = (cityCluster) => {
    let markers = [...clustersMarker]
    markers = markers.map((m) => {
      return m.markers
    })
    markers = markers.flat()

    setMarkers(markers)
    setMapView('company')
    setClustersMarker([])

    setMapCoord(prev => ({...prev, latitude: +cityCluster.markers[0].latitude, longitude: +cityCluster.markers[0].longitude, zoom: 14}))
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
        onClick={() => {setMapView('company'); loadClusterMarkers(cityCluster)}}
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



  // Получение и отрисовка городов
  const createCityMarker = (cityMarker) => {
    const markerId = Math.floor(Math.random() * 200) * Math.floor(Math.random() * 400)
    return (
      <Marker 
        key={markerId} 
        longitude={+cityMarker.longitude} 
        latitude={+cityMarker.latitude} 
        onClick={() => getCityCompanies(cityMarker)}
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

  async function getCities() {
    // axios.get(`https://api.npoint.io/dbbe065fcd8b2f1f3288`)
    // setIsLoader(true)
    axios.get(`${url}/api/Company/GetCities`)
      .then((response) => {
        getCityCompanies(response.data[0])

        setCitiesMarker(response.data)
        setInitCity(response.data[0].title)
      })
      .catch((error) => {
        console.error(error);
        console.warn('can not load cities');
        setIsLoader(false)
      })

      setIsCitiesLoaded(true)
  }








  // Хэндлеры и обработчики
  const createMarkerHanlder = () => {
    // if(isAuthorize) {
      setTarget(true);
      document.querySelectorAll('.category-item').forEach(item => item.classList.remove('selected'));
      setIsMarkerCreate('INIT')
      setMarkers([{id: 0, latitude: mapCoord.latitude, longitude: mapCoord.longitude}])
      // setMarkers(markersCopy) // -
    // } else {
    //   alert('Вы не авторизованы!')
    // }
  };

  const onMarkerClick = (id) => {
    if(isMarkerCreate) return;
    // if(Object.keys(currentCompany).length >= 1) return;
    const targetCompany = markers.find(m => m.id === id);
    setCurrentCompany(targetCompany);
    setIsCompanySelected(true);
  }

  const mapClickHandler = (e) => {
    // console.log(mapRef.current.getMap());
    // console.log(mapRef.current.queryRenderedFeatures());
    if(isMarkerCreate === true) {
      setIsMarkerCreate('INIT')
      setNewMarker({id: 0, latitude: e.lngLat[1], longitude: e.lngLat[0]})
      // setMarkers((prev) => [...prev, {id: 0, latitude: e.lngLat[1], longitude: e.lngLat[0]}])
      setMarkers([{id: 0, latitude: e.lngLat[1], longitude: e.lngLat[0]}])
    }
  }

  const mapStateChange = (evt) => {
    // console.log(Math.ceil(evt.viewState.zoom));
    // console.log(mapCoord.zoom);
    // console.log(mapView);
    // console.log(mapView);
    if(lastZoom === evt.viewState.zoom) return 1;
    console.log(12);
    if(evt.viewState.zoom <= 7 && !isMarkerCreate && mapView === 'company') {
      console.log(1);
      setMarkers([])
      setMapView('city')
    }
    
    if(evt.viewState.zoom < 7 && !isMarkerCreate && mapView === 'cluster') {
      console.log(2);
      setClustersMarker([])
      setMapView('city')
    }
    
    if(Math.ceil(evt.viewState.zoom) > 7 && Math.ceil(evt.viewState.zoom) < 13 && mapView !== 'cluster' && mapView !== 'city') {
      console.log(3); 
      const clusters = createClusters(markers)
      setClustersMarker(clusters)

      setMapView('cluster')
    }

    if(evt.viewState.zoom > 13 && mapView === 'cluster') {
      console.log(4);
      let markers = [...clustersMarker]
      markers = markers.map((m) => {
        return m.markers
      })
      markers = markers.flat()
      
      setClustersMarker([])
      setMapView('company')

      setMarkers(markers)
    }

    if(Math.ceil(evt.viewState.zoom) < 13  && mapView === 'cluster') {
      console.log(5);

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
        setLoginMethod,
        user,
        mapCoord,
        setUser,
        isAuthorize,
        // currentPos,
        setIsAuthorize,
        target,
        setTarget,
        markers,
        setMarkers,
        isMarkerCreate,
        setIsMarkerCreate,  
        newMarker,
        setNewMarker,
        currentLang,
        setCurrentLang,
        setMapCoord,
        markersCopy,
        setMarkersCopy,
        citiesMarker,
        readonlyMarkers,
        initCity,
        setInitCity,
        setIsLoader,
        mapView,
        setMapView,
        createClusters,
        setClustersMarker,
        createMarkerHanlder,
        setPopup,
        popup
      }}
    >
      <div className="App">
        {popup ? <Popup clickTrue={() => {setPopup(false); createMarkerHanlder()}} clickFalse={() => setPopup(false)}/> : ''}
        {isLoader ? <Loader /> : ""}
        <Login method={loginMethod} onClose={() => setLoginMethod("")} />
        
        {isAuthorize && Object.keys(user).length > 0 ? <Header user={user}/> : <Header />}

        <div className="innerCard">
          <Card />
          {isCompanySelected && !target ? <CardCompany company={currentCompany} setCompany={setCurrentCompany} user={user} isCommentVisible={true} onClose={() => {setIsCompanySelected(false); setCurrentCompany({})}}/> : ''}
        </div>
        <MapGL
          ref={mapRef}
          {...mapCoord}
          width="100vw"
          height="100vh"
          mapStyle="mapbox://styles/babichdima/cksj6yk2baq5217pja2fqa5r8"
          onViewportChange={setMapCoord}
          mapboxApiAccessToken={TOKEN}
          onClick={mapClickHandler}
          onViewStateChange={mapStateChange}
        >
          {/* {mapCoord.zoom <= 10 ? mapCities : mapMarkers} */}
          {!isMarkerCreate && !target
            ? mapView === 'company' 
              ? mapMarkers 
              : mapView === 'city' 
                ? mapCities 
                : mapClusters
            : mapMarkers
          }
          {/* {mapClusters} */}
          {/* <Marker latitude={mapCoord.latitude} longitude={mapCoord.longitude}>
          <img 
              style={{ pointerEvents: 'none' }}
              // style={{ transform: `translate(${-MARKER_SIZE / 2}px,${-MARKER_SIZE}px)`, pointerEvents: 'none' }}
              src="/img/map-marker.webp"
              alt="marker"
              width="65"
              height="65"
          />
          </Marker> */}
          {/* {markers.length && mapView === 'company' ? mapMarkers : ''}
          {mapView === 'city' ? mapCities : ''} */}
        </MapGL>
        <MarkerCreator changeTarget={createMarkerHanlder} currentLang={currentLang}/>
      </div>
    </AppContext.Provider>
  );
}

export default App;
