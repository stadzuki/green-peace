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

const url = 'http://7bbd-188-119-45-172.ngrok.io'

function App() {

  // const [mm, setMM] = useState(false)

  const city = [
    {name: 'minsk', latitude: 53.893009, longitude: 27.567444},
    {name: 'grodno', latitude: 53.669353, longitude: 23.813131},
    {name: 'pinsk', latitude: 52.129272, longitude: 26.074677},
  ]

  const [markers, setMarkers] = useState([
    {name: 'minsk', latitude: 53.893009, longitude: 27.567444},
    {name: 'grodno', latitude: 53.669353, longitude: 23.813131},
  ]);

  const mapMarkers = React.useMemo(() => markers.map(
    c => (
      <Marker key={c.name} longitude={c.longitude} latitude={c.latitude} >
        <Pin size={20} />
      </Marker>
    )
  ), [markers]);

  const [mapCoord, setMapCoord] = useState({
    latitude: 53.893009,
    longitude: 	27.567444,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });

  const [isLoader, setIsLoader] = useState(false);

  //Map
  const [isGettedLocate, setIsGettedLocate] = useState(false);

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

  function getLocation() {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCoord((prev) => {
            return {...prev, latitude: position.coords.latitude, longitude: position.coords.longitude}
          })
        },
        () => {
          console.log("Unable to retrieve your location");
        }
      );
    }
    setIsGettedLocate(true);
  };

  function getMarkers() {
    axios.get(`${url}/api/Company/GetCompanies`)
      .then((response) => {
        setMarkers(response.data)
        console.log(markers);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    // getMarkers()

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

  // useEffect(() => {
  //   axios.get(`${url}/api/Company/GetCompanies`)
  //     .then((response) => {
  //       markers = response.data;
  //       console.log(markers);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // })

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

        <button onClick={(e) => {
          e.preventDefault();
          setMarkers((prev) => {
            return [...prev, {name: 'pinsk', latitude: 52.129272, longitude: 26.074677}]
          })
        }}>123213213213213213123213</button>

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
        <MarkerCreator changeTarget={createMarkerHanlder} />
      </div>
    </AppContext.Provider>
  );
}

export default App;
