// function getLocation() {
  //   if (!navigator.geolocation) {
  //     console.log("Geolocation is not supported by your browser");
  //   } else {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setMapCoord((prev) => {
  //           return {...prev, latitude: position.coords.latitude, longitude: position.coords.longitude}
  //         })
  //         setCurrentPos({latitude: position.coords.latitude, longitude: position.coords.longitude})
  //       },
  //       () => {
  //         console.log("Unable to retrieve your location");
  //       },
  //       {
  //         enableHighAccuracy: true
  //       }
  //     );
  //   }
  //   setIsGettedLocate(true);
  // };


  // useEffect(() => {
  //   if(isMarkersLoaded) return 1;
  //   getMarkers()
  // })

  function getMarkers() {
    // axios.get(`${url}/api/Company/GetCompanies`, {headers: {'Content-Length': 6000}})
    axios.get(`https://api.npoint.io/3d5795e1a47fe9cb1c83`)
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