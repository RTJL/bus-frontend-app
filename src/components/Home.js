import React, { useState, useEffect } from "react";
import ArrivalService from "../services/ArrivalService";
import BusStopsService from "../services/BusStopsService";
import BusesDataService from "../services/BusesService";
import { Service } from "../services/DbService";
import { getBoundsOfDistance } from "geolib";

const Home = () => {
  const [busStopCode, setBusStopCode] = useState("");
  // const [coord, setCoord] = useState({
  //   lat: 0,
  //   lng: 0
  // });
  const [nearestBusStops, setNearestBusStops] = useState({});
  const [busStopArrival, setBusStopArrival] = useState({});
  const [isUpdatingCache, setIsUpdatingCache] = useState(true);

  useEffect(() => {
    const checkAndUpdateCache = async() => {
      const noOfBusStop = await Service.getBusStopCount();
      var requests = [];
      if (noOfBusStop === 0) {
        requests.push(BusStopsService.updateCache());
        requests.push(BusesDataService.updateCache());
      }
      Promise.all(requests)
        .then(() => {
          console.log("udpated cache");
          setIsUpdatingCache(false);
        });
    }
    checkAndUpdateCache();
  }, [])

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
    var busStopDict = {
      [busStopCode]: busStop
    };
    const arrivalDict = await updateArrivals(busStopDict);
    setNearestBusStops(busStopDict);
    setBusStopArrival(arrivalDict);

    console.log(busStopDict);
  }

  const handleNearbyClick = () => {
    setBusStopCode("");
    setNearestBusStops({});
    setBusStopArrival({});
    navigator.geolocation.getCurrentPosition(updateCoord);
  }

  const handleReloadClick = async () => {
    const arrivalDict = await updateArrivals(nearestBusStops);
    setBusStopArrival(arrivalDict);
  }

  const updateCoord = async (position) => {
    // const lat = 1.421202;
    // const lng = 103.833704;
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    if (lat === 0 || lng === 0) {
      return;
    }

    console.log(position);
    const bounds = getBoundsOfDistance(
      { lat: lat, lng: lng}, 300
    );

    const busStopDict = await updateNearestBusStops(bounds);
    const arrivalDict = await updateArrivals(busStopDict);
    setNearestBusStops(busStopDict);
    setBusStopArrival(arrivalDict);
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
    var dict = {};
    busStops.forEach(stop => {
      dict[stop.BusStopCode] = stop;
    });
    console.log(busStops);
    return dict;
  }

  const updateArrivals = async (nearestBusStops) => {
    const stops = Object.keys(nearestBusStops);
    const responses = await ArrivalService.getAll(stops);

    var dict = {};
    responses.forEach((response,index) => {
      dict[stops[index]] = response.data.services;
    });

    return dict;
  }

  return (
    <>
    {isUpdatingCache ? (
      <>
      <p>Checking for new buses and stops</p>
      </>
    ) : (
      <>
        <h1></h1>
        <button
          type="button"
          onClick={handleNearbyClick}
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
          onClick={handleReloadClick}
        >
          Reload
        </button>

        <br/>

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
    )}

    </>
  )
}

export default Home;
