import React, { useState, useEffect } from "react";
import BusStopsService from "../services/BusStopsService";

const BusStopsList = () => {
  const [busStops, setBusStops] = useState([]);
  const [currentBusStop, setCurrentBusStop] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    retrieveBusStops();
  }, []);

  const retrieveBusStops = () => {
    BusStopsService.getAll()
      .then(response => {
        setBusStops(response.data.busStops);
        console.log(response.data.busStops);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const setActiveBusStop = (busStop, index) => {
    setCurrentBusStop(busStop);
    setCurrentIndex(index);
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
