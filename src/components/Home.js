import React, { useState, useEffect } from "react";
import ArrivalService from "../services/ArrivalService";
import { Service } from "../services/DbService";
import { getBoundsOfDistance, computeDestinationPoint, MAXLON } from 'geolib';

const Home = () => {
  const [busStopCode, setBusStopCode] = useState("");
  const [coord, setCoord] = useState({
    lat: 0,
    lng: 0
  });
  const [nearestBusStops, setNearestBusStops] = useState([]);
  const [busStopArrival, setBusStopArrival] = useState([]);

  useEffect(() => {
    const updateNearestBusStops = async() => {
      const lat = 1.421202;
      const lng = 103.833704;

      if (lat === 0 || lng === 0) {
        return;
      }

      const abc = getBoundsOfDistance(
        { lat: lat, lng: lng}, 300
      );

      const minLat = abc[0].latitude;
      const minLng = abc[0].longitude;

      console.log(minLat + ", " + minLng);

      const maxLat = abc[1].latitude;
      const maxLng = abc[1].longitude;

      console.log(maxLat + ", " + maxLng);

      const latBusStops = await Service.getBusStopLatBound(minLat, maxLat);
      console.log(latBusStops);
      const busStops = latBusStops.filter(latBusStop => {
        return latBusStop.Longitude < maxLng && latBusStop.Longitude > minLng;
      });
      //const lngBusStops = await Service.getBusStopLngBound(minLng, maxLng);
      //console.log(lngBusStops);
      // const busStops = latBusStops.filter(latBusStop => {
      //   return lngBusStops.some(lngBusStop => lngBusStop.BusStopCode === latBusStop.BusStopCode);
      // });
      setNearestBusStops(busStops);
      console.log(busStops);
    }
    updateNearestBusStops();
  }, [coord])

  const onChangeBusStopCode = e => {
    const code = e.target.value;
    setBusStopCode(code);
  }

  const arrivalById = () => {
    if (busStopCode.length !== 5 || !Number(busStopCode)) {
      alert("Invalid busstop code");
      return;
    }

    ArrivalService.get(busStopCode)
      .then(response => {
        setBusStopArrival(response.data.services);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const getCoord = () => {
    navigator.geolocation.getCurrentPosition(position => {
      setCoord({ lat: position.coords.latitude, lng: position.coords.longitude });
    });
  }

  return (
    <>
    <h1></h1>
    <button
      type="button"
      onClick={getCoord}
    >
      Nearby
    </button>
    <input
      type="text"
      placeholder="Enter busstop number"
      value={busStopCode}
      onChange={onChangeBusStopCode}
    />
    <button
      type="button"
      onClick={arrivalById}
    >
      Search
    </button>
    <button
      type="button"
      onClick={arrivalById}
    >
      Reload
    </button>

    <br/>

    <>
      {busStopArrival.map((service, index) =>(
        <div key={index}>
        <h3>{service.ServiceNo}</h3>
        <ul>
          <li key={index.toString() + "1"}>
            {service.NextBus.EstimatedArrival}
          </li>
          <li key={index.toString() + "2"}>
            {service.NextBus2.EstimatedArrival}
          </li>
          <li key={index.toString() + "3"}>
            {service.NextBus3.EstimatedArrival}
          </li>
        </ul>
        </div>
      ))}
    </>

    </>
  )
}

export default Home;
