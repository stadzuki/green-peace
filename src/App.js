import React, { useRef, useEffect, useState } from 'react';
import AppContext from './context'

// import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
import ReactMapGL , {Marker} from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

import Header from './components/Header';
import Login from './components/Login/Login';
import Card from './components/Card/Card';
import Loader from './components/Loader';
import MarkerCreator from './components/MarkerCreator';

import jwtDecode from 'jwt-decode';
import axios from 'axios';

import Pin from './components/Pin'

// const Map = ReactMapGL({
//   accessToken:
//     'pk.eyJ1IjoibG9saWsyMCIsImEiOiJja3N6NDhlZ2oycGxnMndvZHVkbGV0MTZ1In0.JkdOOOgJTsu1Sl2qO-5VAA'
// });

function App() {
  const url = 'http://5f63-188-119-45-172.ngrok.io';

  const [isLoader, setIsLoader] = React.useState(false)

  //Map
  const [isGettedLocate, setIsGettedLocate] = useState(false)

  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  //Auth
  const [token, setToken] = useState('');
  const [loginMethod, setLoginMethod] = React.useState('')

  //User
  const [user, setUser] = useState({})
  const [isAuthorize, setIsAuthorize] = useState(false)

  //Marker
  const [target, setTarget] = useState(false)
  /* login, icon, email, socialAuth*/

  const createMarkerHanlder = () => {
    // if(isAuthorize) {
      setTarget(true)
    // } else {
    //   alert('Вы не авторизованы!')
    // }
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      }, () => {
        console.log('Unable to retrieve your location');
      });
    }
    setIsGettedLocate(true);
  }

  useEffect(() => {

    if(token === '') {
      // setIsLoader(true)
      const tokenJWT = JSON.parse(localStorage.getItem('token'));
      
      if(tokenJWT !== null && isAuthorize === false && tokenJWT !== undefined) {
        const payloads = jwtDecode(tokenJWT);

        console.log('zashel');

        axios.get(`${url}/Users/${payloads.id}`, { headers: {"Authorization" : `${tokenJWT}`}})
        .then(response => {
          setUser({
            id: response.data.id,
            email: response.data.email,
            login: response.data.name,
            icon: response.data.avatarUrl,
          })
          console.log(response);
          console.log(user);
          setIsAuthorize(true)
        })
        .catch(error => {
          console.log(error);
        })

        setToken(tokenJWT)
      } 
      
      setIsLoader(false)
    }

    if(!isGettedLocate) {
      getLocation()
    }
  });


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
      }}
    >
      <div className="App">
        {isLoader ? <Loader/>  : ''}

        <Login method={loginMethod} onClose={() => setLoginMethod('')}/>
        
        <Header/>
        
        <Card/>

        <ReactMapGL 
          mapboxApiAccessToken={"pk.eyJ1IjoibG9saWsyMCIsImEiOiJja3N6NDhlZ2oycGxnMndvZHVkbGV0MTZ1In0.JkdOOOgJTsu1Sl2qO-5VAA"}
          mapStyle="mapbox://styles/babichdima/cksj6yk2baq5217pja2fqa5r8"
          width="100vw"
          height="100vh"
          longitude={lng}
          latitude={lat}
          zoom={19}
          // onClick={(e) => console.log(e)}
        >
          <Marker
          longitude={lng}
          latitude={lat}
          offsetTop={-20}
          offsetLeft={-10}
          draggable
        >
          <Pin size={20} />
        </Marker>
        </ReactMapGL>

        <MarkerCreator changeTarget={createMarkerHanlder}/>

      </div>
    </AppContext.Provider>
  );
}

export default App;
