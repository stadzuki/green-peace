import React, { useRef, useEffect, useState } from 'react';
import AppContext from './context'
import mapboxgl from 'mapbox-gl';

import Header from './components/Header';
import Login from './components/Login/Login';
import Card from './components/Card/Card';

mapboxgl.accessToken = 'pk.eyJ1IjoibG9saWsyMCIsImEiOiJja3N6NDhlZ2oycGxnMndvZHVkbGV0MTZ1In0.JkdOOOgJTsu1Sl2qO-5VAA';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [loginMethod, setLoginMethod] = React.useState('')

  useEffect(() => {
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
        setLoginMethod
      }}
    >
      <div className="App">
        <Login method={loginMethod} onClose={() => setLoginMethod('')}/>
        
        <Header onClickSignUp={() => setLoginMethod('signUp')} onClickSignIn={() => setLoginMethod('signIn')}/>

        <Card/>

        <div ref={mapContainer} className="map-container" />

      </div>
    </AppContext.Provider>
  );
}

export default App;
