import React, { useState, useEffect } from "react";
import { getBoundsOfDistance, getDistance } from "geolib";

import Search from "../components/Search";
import BusStopList from "../components/BusStopList";
import { Service } from "../services/DbService";

const HomePage = () => {
  const [toggleClear, setToggleClear] = useState(false);
  const [allBusStops, setAllBusStops] = useState([]);
  const [nearestBusStops, setNearestBusStops] = useState([]);

  const onChangeSearchText = async (e, v) => {
    console.log(v);
    if (v){
      const busStop = await Service.getBusStop(v);
      setNearestBusStops([busStop]);
    } else if (!v) {
      setNearestBusStops([]);
    }
  }

  const onClickLocation = () => {
    setNearestBusStops([]);
    navigator.geolocation.getCurrentPosition(updateCoord, coordError);
    setToggleClear(!toggleClear);
  }

  useEffect(() => {
    const getAllBusStop = async() => {
      const busStopList = await Service.getAllBusStop();
      setAllBusStops(busStopList);
    }
    navigator.geolocation.getCurrentPosition(updateCoord, coordError);
    getAllBusStop();
  }, [])

  const updateCoord = async (position) => {
    // const lat = 1.421202;
    // const lng = 103.833704;
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const currentLatLng = { lat: lat, lng: lng};

    if (lat === 0 || lng === 0) {
      return;
    }

    const bounds = getBoundsOfDistance(
      currentLatLng, 300
    );

    const busStops = await updateNearestBusStops(bounds);
    const sorted = sortBusStops(currentLatLng, busStops);
    setNearestBusStops(sorted);
  }

  const updateNearestBusStops = async (bounds) => {
    const minLat = bounds[0].latitude;
    const minLng = bounds[0].longitude;
    const maxLat = bounds[1].latitude;
    const maxLng = bounds[1].longitude;

    const latBusStops = await Service.getBusStopLatBound(minLat, maxLat);
    const busStops = latBusStops.filter(latBusStop => {
      return latBusStop.Longitude < maxLng && latBusStop.Longitude > minLng;
    });

    return busStops;
  }

  const sortBusStops = (currentLatLng, busStops) => {
    busStops.map(stop => {
      stop.Distance = getDistance(currentLatLng, {latitude: stop.Latitude, longitude: stop.Longitude})
      return stop
    })
    busStops.sort((a, b) => a.Distance - b.Distance);
    return busStops;
  }

  const coordError = (error) => {
    var msg = '';
    switch(error.code) {
      case error.PERMISSION_DENIED:
        msg = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        msg = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        msg = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
      default:
        msg = "An unknown error occurred."
        break;
    }
    alert(msg);
  }

  return (
    <>
    <Search
      toggleClear={toggleClear}
      allBusStops={allBusStops}
      onChangeSearchText={onChangeSearchText}
      onClickLocation={onClickLocation}
    />
    <BusStopList nearestBusStops={nearestBusStops}/>
    </>
  )
}

export default HomePage;
