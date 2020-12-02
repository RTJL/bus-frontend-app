import React, { useState, useEffect } from "react";
import BusesDataService from "../services/BusesService";
import { Service } from "../services/DbService";

const BusesList = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchData = async() => {
      const response = await BusesDataService.getAll();
      await updateBusDb(response.data.buses);
      setBuses(response.data.buses);
    }

    fetchData();
  }, []);

  const updateBusDb = (buses) => {
    Service.putAllBuses(buses)
  }

  return (
    <>
    <h1>Bus List</h1>
    <ul>
      {buses &&
        buses.map((bus, index) => (
          <li
            key={index}
          >
            {bus.ServiceNo}
          </li>
        ))
      }
    </ul>
    </>
  );
};

export default BusesList;
