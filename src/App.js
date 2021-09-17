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

const TOKEN = 'pk.eyJ1IjoibG9saWsyMCIsImEiOiJja3N6NDhlZ2oycGxnMndvZHVkbGV0MTZ1In0.JkdOOOgJTsu1Sl2qO-5VAA';

const url = 'https://648c-188-119-45-172.ngrok.io'


// const data1 = {
//   datasets: [
//     {
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)',
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)',
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

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
  const [isMarkersLoaded, setIsMarkersLoaded] = useState(false);
  const [isMarkerCreate, setIsMarkerCreate] = useState(false)
  const [target, setTarget] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [newMarker, setNewMarker] = useState({})

  //Company
  const [isCompanySelected, setIsCompanySelected] = useState(false)
  const [currentCompany, setCurrentCompany] = useState({})

  let userDublicate = {}

  const onMarkerClick = (id) => {
    if(isMarkerCreate) return;
    const targetCompany = markers.find(m => m.id === id);
    setCurrentCompany(targetCompany);
    setIsCompanySelected(true);
  }

  const createMarker = (marker) => {
    return (
      <Marker key={marker.id} longitude={+marker.longitude} latitude={+marker.latitude}>
        {/* <Pin count={2} color={['red', 'black']} /> */}
        {/* <div className={`markerMetaWrapper ${isMetaVisible ? 'visible' : ''}`}>
          <p>{marker.title}</p>
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
                <li className={`category-item ${target.type}-meta`}>
                    <img src={target.img}
                    width="70"
                    height="70"
                    alt={`${target.type} category`} 
                /></li>onMouseEnter={() => {setIsMetaVisible(true); console.log(1)}}
                onMouseLeave={() => setIsMetaVisible(false)}
              )
            })}
          </ul>
        </div> */}
        <img 
          src="/img/map-marker.png"
          alt="marker"
          width="50"
          height="50"
          onClick={() => onMarkerClick(marker.id)}
        />
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
        }
      );
    }
    setIsGettedLocate(true);
  };

  function getMarkers() {
    // axios.get(`${url}/api/Company/GetCompanies`)
    axios.get(`https://api.npoint.io/66155237175de1dd9dc7`)
      .then((response) => {
        setMarkers(response.data)
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
      setNewMarker({id: 0, latitude: e.lngLat[1], longitude: e.lngLat[0]})
      setMarkers((prev) => [...prev, {id: 0, latitude: e.lngLat[1], longitude: e.lngLat[0]}])
      setIsMarkerCreate('INIT')
    }
  }

  // var MyComponent = React.createClass({
  //   render: function() {
  //     return <Doughbut data={chartData} options={chartOptions}/>
  //   }
  // });

  return (
    <AppContext.Provider
      value={{
        setLoginMethod,
        user,
        setUser,
        isAuthorize,
        setIsAuthorize,
        target,
        setTarget,
        markers,
        setMarkers,
        isMarkerCreate,
        setIsMarkerCreate,  
        newMarker,
        currentLang,
        setCurrentLang,
        setMapCoord
      }}
    >
      <div className="App">
        {/* <Doughnut data={data1} /> */}
        {/* <Pin count={2} color={['red', 'black']} /> */}
        {isLoader ? <Loader /> : ""}
        <Login method={loginMethod} onClose={() => setLoginMethod("")} />
        
        {isAuthorize && Object.keys(user).length > 0 ? <Header user={user}/> : <Header />}

        <div className="innerCard">
          <Card />
          {isCompanySelected ? <CardCompany company={currentCompany} userPos={currentPos} onClose={() => setIsCompanySelected(false)}/> : ''}
        </div>
        <MapGL
          {...mapCoord}
          width="100vw"
          height="100vh"
          mapStyle="mapbox://styles/babichdima/cksj6yk2baq5217pja2fqa5r8"
          onViewportChange={setMapCoord}
          mapboxApiAccessToken={TOKEN}
          onClick={mapClickHandler}
        >
          {mapMarkers}
        </MapGL>
        <MarkerCreator changeTarget={createMarkerHanlder} currentLang={currentLang}/>
      </div>
    </AppContext.Provider>
  );
}

export default App;
