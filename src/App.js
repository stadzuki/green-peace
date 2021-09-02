import React, { useRef, useEffect, useState } from 'react';
import AppContext from './context'
import mapboxgl from 'mapbox-gl';

import Header from './components/Header';
import Login from './components/Login/Login';
import Card from './components/Card/Card';
import Loader from './components/Loader';


import jwtDecode from 'jwt-decode';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoibG9saWsyMCIsImEiOiJja3N6NDhlZ2oycGxnMndvZHVkbGV0MTZ1In0.JkdOOOgJTsu1Sl2qO-5VAA';

function App() {
  const url = 'http://5f63-188-119-45-172.ngrok.io';

  const [isLoader, setIsLoader] = React.useState(true)

  //Map
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  //Auth
  const [token, setToken] = useState('');
  const [loginMethod, setLoginMethod] = React.useState('')

  //User
  const [user, setUser] = useState({})
  const [isAuthorize, setIsAuthorize] = useState(false)
  /* login, icon, email, socialAuth*/

  useEffect(() => {

    if(token === '') {
      const tokenJWT = JSON.parse(localStorage.getItem('token'));
      
      if(tokenJWT !== null && isAuthorize === false && tokenJWT !== undefined) {
        const payloads = jwtDecode(tokenJWT);

        setIsLoader(true)
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
        setIsLoader(false)
      } 
    }

    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/babichdima/cksj6yk2baq5217pja2fqa5r8',
      center: [lng, lat],
      zoom: zoom
    });
  });

  return (
    <AppContext.Provider
      value={{
        setLoginMethod,
        user,
        setUser,
        isAuthorize,
        setIsAuthorize
      }}
    >
      <div className="App">
        {isLoader ? <Loader/>  : ''}
        <Login method={loginMethod} onClose={() => setLoginMethod('')}/>
        
        <Header/>
        
        <Card/>

        <div ref={mapContainer} className="map-container" />

      </div>
    </AppContext.Provider>
  );
}

export default App;
