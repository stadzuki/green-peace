import React, { useRef, useEffect, useState } from "react";
import AppContext from "./context";

import MapGL, { Marker } from "react-map-gl";

import Header from "./components/Header";
import Login from "./components/Login/Login";
import Card from "./components/Card/Card";
import Loader from "./components/Loader";
import MarkerCreator from "./components/MarkerCreator";

import jwtDecode from "jwt-decode";
import axios from "axios";

import Pin from "./components/Pin";

const TOKEN = 'pk.eyJ1IjoibG9saWsyMCIsImEiOiJja3N6NDhlZ2oycGxnMndvZHVkbGV0MTZ1In0.JkdOOOgJTsu1Sl2qO-5VAA';

const markers = [
  {latitude: 53.669353, longitude: 23.813131},
  {latitude: 53.5904, longitude: 24.2478},
];

function App() {
  const url = "http://5f63-188-119-45-172.ngrok.io";

  const [mapCoord, setMapCoord] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });

  const [marker, setMarker] = useState({
    latitude: 40,
    longitude: -100,
  });

  // const onMarkerDragEnd = React.useCallback(event => {
  //   setMarker({
  //     longitude: event.lngLat[0],
  //     latitude: event.lngLat[1]
  //   });
  // }, []);

  const [isLoader, setIsLoader] = useState(false);

  //Map
  const [isGettedLocate, setIsGettedLocate] = useState(false);

  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  //Auth
  const [token, setToken] = useState("");
  const [loginMethod, setLoginMethod] = React.useState("");

  //User
  const [user, setUser] = useState({});
  const [isAuthorize, setIsAuthorize] = useState(false);

  //Marker
  const [target, setTarget] = useState(false);
  /* login, icon, email, socialAuth*/

  const createMarkerHanlder = () => {
    // if(isAuthorize) {
    setTarget(true);
    // } else {
    //   alert('Вы не авторизованы!')
    // }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        () => {
          console.log("Unable to retrieve your location");
        }
      );
    }
    setIsGettedLocate(true);
  };

  useEffect(() => {
    if (token === "") {
      // setIsLoader(true)
      const tokenJWT = JSON.parse(localStorage.getItem("token"));

      if (
        tokenJWT !== null &&
        isAuthorize === false &&
        tokenJWT !== undefined
      ) {
        const payloads = jwtDecode(tokenJWT);

        console.log("zashel");

        axios
          .get(`${url}/Users/${payloads.id}`, {
            headers: { Authorization: `${tokenJWT}` },
          })
          .then((response) => {
            setUser({
              id: response.data.id,
              email: response.data.email,
              login: response.data.name,
              icon: response.data.avatarUrl,
            });
            console.log(response);
            console.log(user);
            setIsAuthorize(true);
          })
          .catch((error) => {
            console.log(error);
          });

        setToken(tokenJWT);
      }

      setIsLoader(false);
    }

    if (!isGettedLocate) {
      getLocation();
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
        {isLoader ? <Loader /> : ""}

        <Login method={loginMethod} onClose={() => setLoginMethod("")} />

        <Header />

        <Card />

        <MapGL
          {...mapCoord}
          width="100vw"
          height="100vh"
          mapStyle="mapbox://styles/babichdima/cksj6yk2baq5217pja2fqa5r8"
          onViewportChange={setMapCoord}
          mapboxApiAccessToken={TOKEN}
        >
          {/* <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            offsetTop={-20}
            offsetLeft={-10}
          >
            <Pin size={20} />
          </Marker> */}
          {markers.map(item => {
            <Marker
              longitude={item.longitude}
              latitude={item.latitude}
              offsetTop={-20}
              offsetLeft={-10}
            >
              <Pin size={20} />
            </Marker>
          })}
        </MapGL>

        <MarkerCreator changeTarget={createMarkerHanlder} />
      </div>
    </AppContext.Provider>
  );
}

export default App;
