import React, { useEffect, useState } from "react";
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

const TOKEN = 'pk.eyJ1IjoibG9saWsyMCIsImEiOiJja3N6NDhlZ2oycGxnMndvZHVkbGV0MTZ1In0.JkdOOOgJTsu1Sl2qO-5VAA';

const MARKER_SIZE = 65;

const url = 'https://9810-78-163-110-172.ngrok.io'

//
//
//
//           ПЕРЕПИСАТЬ TOKEN В USE EFFECT
//
//
//

function App() {

  const [isMetaVisible, setIsMetaVisible] = useState(false)

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
  const [isLoader, setIsLoader] = useState(true);

  //Map
  const [mapCoord, setMapCoord] = useState({
    latitude: 53.893009,
    longitude: 	27.567444,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });
  const [isGettedLocate, setIsGettedLocate] = useState(false);

  //Auth
  const [token, setToken] = useState("");
  const [loginMethod, setLoginMethod] = React.useState("");

  //User
  const [user, setUser] = useState({});
  const [isAuthorize, setIsAuthorize] = useState(false);
  const [currentPos, setCurrentPos] = useState({})

  //Marker
  const [readonlyMarkers, setReadonlyMarkers] = useState([])
  const [isMarkersLoaded, setIsMarkersLoaded] = useState(false);
  const [isMarkerCreate, setIsMarkerCreate] = useState(false)
  const [target, setTarget] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [newMarker, setNewMarker] = useState(false)
  const [markersCopy, setMarkersCopy] = useState([]);

  //Company
  const [isCompanySelected, setIsCompanySelected] = useState(false)
  const [currentCompany, setCurrentCompany] = useState({})

  let userDublicate = {}

  const onMarkerClick = (id) => {
    if(isMarkerCreate) return;
    // if(Object.keys(currentCompany).length >= 1) return;
    const targetCompany = markers.find(m => m.id === id);
    setCurrentCompany(targetCompany);
    setIsCompanySelected(true);
  }

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
      >
        {isMarkerCreate !== 'INIT' 
          ? <div className='markerContainer'
              style={{ transform: `translate(${-MARKER_SIZE / 2}px,${-MARKER_SIZE}px)` }}
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
                
                parent.querySelector('.markerMetaWrapper').classList.add('visible');
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
              src="/img/map-marker.webp"
              alt="marker"
              style={{position: 'relative'}}
              width="65"
              height="65"
            />
          </div>
          : <img 
            src="/img/map-marker.webp"
            alt="marker"
            style={{position: 'relative'}}
            width="65"
            height="65"
          />
        }
        
      </Marker>
    )
  }

  const mapMarkers = React.useMemo(() => markers.map(
    marker => (
        createMarker(marker)
    )
  ), [markers]);

  const createMarkerHanlder = () => {
    // if(isAuthorize) {
      setTarget(true);
      document.querySelectorAll('.category-item').forEach(item => item.classList.remove('selected'));
      setMarkers(markersCopy)
    // } else {
    //   alert('Вы не авторизованы!')
    // }
  };

  function getLocation() {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCoord((prev) => {
            return {...prev, latitude: position.coords.latitude, longitude: position.coords.longitude}
          })
          setCurrentPos({latitude: position.coords.latitude, longitude: position.coords.longitude})
        },
        () => {
          console.log("Unable to retrieve your location");
        },
        {
          enableHighAccuracy: true
        }
      );
    }
    setIsGettedLocate(true);
  };

  function getMarkers() {
    axios.get(`${url}/api/Company/GetCompanies`, {headers: {'Content-Length': 6000}})
    // axios.get(`https://api.npoint.io/3d5795e1a47fe9cb1c83`)
      .then((response) => {
        console.log(response.data);
        setMarkers(response.data)
        setMarkersCopy(response.data)
        setReadonlyMarkers(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
      setIsMarkersLoaded(true)
      setIsLoader(false)
  }

  useEffect( async () => {

    if (token === "") {
      // setIsLoader(true)
      const tokenJWT = JSON.parse(localStorage.getItem("token"));

      if (
        tokenJWT !== null &&
        isAuthorize === false &&
        tokenJWT !== undefined
      ) {
        const payloads = jwtDecode(tokenJWT);

        axios
          .get(`${url}/Users/${payloads.id}`, {
            headers: { Authorization: `${tokenJWT}` },
          })
          .then((response) => {
            console.log(response);//data: "", status: 204, statusText: "No Content",

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
          })
          .catch((error) => {
            console.log(error);
        });

        setToken(tokenJWT);
        setIsAuthorize(true);
      }

      // setIsLoader(false);
    }

    if (!isGettedLocate) {
      getLocation();
    }
  });

  useEffect(() => {
    if(isMarkersLoaded) return 1;
    getMarkers()
  })

  const mapClickHandler = (e) => {
    if(isMarkerCreate === true) {
      setIsMarkerCreate('INIT')
      setNewMarker({id: 0, latitude: e.lngLat[1], longitude: e.lngLat[0]})
      setMarkers((prev) => [...prev, {id: 0, latitude: e.lngLat[1], longitude: e.lngLat[0]}])
    }
  }

  return (
    <AppContext.Provider
      value={{
        setLoginMethod,
        user,
        setUser,
        isAuthorize,
        currentPos,
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
        readonlyMarkers
      }}
    >
      <div className="App">
        {isLoader ? <Loader /> : ""}
        <Login method={loginMethod} onClose={() => setLoginMethod("")} />
        
        {isAuthorize && Object.keys(user).length > 0 ? <Header user={user}/> : <Header />}

        <div className="innerCard">
          <Card />
          {isCompanySelected && !target ? <CardCompany company={currentCompany} setCompany={setCurrentCompany} user={user} userPos={currentPos} isCommentVisible={true} onClose={() => {setIsCompanySelected(false); setCurrentCompany({})}}/> : ''}
        </div>
        <MapGL
          {...mapCoord}
          width="100vw"
          height="100vh"
          mapStyle="mapbox://styles/babichdima/cksj6yk2baq5217pja2fqa5r8"
          onViewportChange={setMapCoord}
          mapboxApiAccessToken={TOKEN}
          onClick={mapClickHandler}
          // onViewStateChange={(e) => console.log(e)}
        >
          {mapMarkers}
        </MapGL>
        <MarkerCreator changeTarget={createMarkerHanlder} currentLang={currentLang}/>
      </div>
    </AppContext.Provider>
  );
}

export default App;
