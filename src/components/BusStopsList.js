import React, { useState, useEffect } from "react";
import BusStopsService from "../services/BusStopsService";
import { Service } from "../services/DbService";

const BusStopsList = () => {
  const [busStops, setBusStops] = useState([]);
  const [currentBusStop, setCurrentBusStop] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await BusStopsService.getAll();
      await updateDb(response.data.busStops);
      setBusStops(response.data.busStops);
    }
    
    fetchData();
  }, []);

  const updateDb = (busStops) => {
    Service.putAllBusStop(busStops);
  }

  const setActiveBusStop = (busStop, index) => {
    setCurrentBusStop(busStop);
  };

  return (
    <>
    {currentBusStop ? (
      <>
      <h4>Code: {currentBusStop.BusStopCode}</h4>
      <p>Location: {currentBusStop.RoadName}</p>
      <p>Description: {currentBusStop.Description}</p>
      <p>Lat: {currentBusStop.Latitude}</p>
      <p>Lat: {currentBusStop.Longitude}</p>
      </>
    ) : (
      <>
      <h4>Please click on a busstop.</h4>
      </>
    )}
    <h1>Bus Stop List</h1>
    <ul>
      {busStops &&
        busStops.map((busStop, index) => (
          <li
            onClick={() => setActiveBusStop(busStop, index)}
            key={index}
          >
            {busStop.RoadName} - {busStop.Description}
          </li>
        ))
      }
    </ul>
    </>
  )
}

export default BusStopsList;
