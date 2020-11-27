import React, { useState, useEffect } from "react";
import ArrivalService from "../services/ArrivalService";
import { Service } from "../services/DbService";
import { getBoundsOfDistance } from "geolib";

const Home = () => {
  const [busStopCode, setBusStopCode] = useState("");
  const [coord, setCoord] = useState({
    lat: 0,
    lng: 0
  });
  const [nearestBusStops, setNearestBusStops] = useState({});
  const [busStopArrival, setBusStopArrival] = useState({});

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
      const maxLat = abc[1].latitude;
      const maxLng = abc[1].longitude;

      const latBusStops = await Service.getBusStopLatBound(minLat, maxLat);
      const busStops = latBusStops.filter(latBusStop => {
        return latBusStop.Longitude < maxLng && latBusStop.Longitude > minLng;
      });
      var dict = {};
      busStops.forEach(stop => {
        dict[stop.BusStopCode] = stop;
      });
      console.log(busStops);

      setNearestBusStops(dict);
    }
    updateNearestBusStops();
  }, [coord])

  useEffect(() => {
    const updateArrivals = async () => {
      const stops = Object.keys(nearestBusStops);
      const responses = await ArrivalService.getAll(stops);
      responses.map((response, index) => {
        setBusStopArrival(prevBusArrival => ({
          ...prevBusArrival, 
          [stops[index]]: response.data.services
        }))
      });
    }
    updateArrivals();
  }, [nearestBusStops]);

  const onChangeBusStopCode = e => {
    const code = e.target.value;
    setBusStopCode(code);
  }

  const arrivalById = async () => {
    if (busStopCode.length !== 5 || !Number(busStopCode)) {
      alert("Invalid busstop code");
      return;
    }

    const busStop = await Service.getBusStop(busStopCode);
    var dict = {};
    dict[busStopCode] = busStop;
    console.log(dict);
    setNearestBusStops(dict);

    const response = await ArrivalService.get(busStopCode);
    setBusStopArrival({ busStopCode:response.data.services});
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
      {busStopArrival && Object.keys(busStopArrival).map((key, index) =>(
        <div key={key}>
        {nearestBusStops[key] &&
        (
          <h2>{nearestBusStops[key].Description} - {nearestBusStops[key].RoadName} ({nearestBusStops[key].BusStopCode})</h2>
        )
        }
        {nearestBusStops[key] && busStopArrival[key].map((service, index) => (
          <div key={service.ServiceNo + key}>
            <h3>{service.ServiceNo}</h3>
            <ul>
              {service.NextBus.EstimatedArrival &&
                <li key={index.toString() + "1"}>
                  {service.NextBus.EstimatedArrival}
                </li>
              }
              {service.NextBus2.EstimatedArrival &&
                <li key={index.toString() + "2"}>
                  {service.NextBus2.EstimatedArrival}
                </li>
              }
              {service.NextBus3.EstimatedArrival &&
                <li key={index.toString() + "3"}>
                  {service.NextBus3.EstimatedArrival}
                </li>
              }
            </ul>
          </div>
        ))}
        </div>
      ))}
    </>

    <br/>

    </>
  )
}

export default Home;
