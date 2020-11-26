import React, { useState, useEffect } from "react";
import BusesDataService from "../services/BusesService";

const BusesList = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    retrieveBuses();
  }, []);

  const retrieveBuses = () => {
    BusesDataService.getAll()
      .then(response => {
        setBuses(response.data.buses);
        console.log(response.data.buses);
      })
      .catch(e => {
        console.log(e);
      });
  };

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
