import React, { useState } from "react";
import ArrivalService from "../services/ArrivalService";

const Home = () => {
  const [busStopCode, setBusStopCode] = useState("");
  const [busStopArrival, setBusStopArrival] = useState([]);

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

  return (
    <>
    <h1></h1>
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
