import http from "../http-common";
import { Service } from "../services/DbService";

const getAll = () => {
  return http.get("/bus-stops");
}

const updateCache = () => {
  return getAll()
    .then(response => {
      Service.putAllBusStop(response.data.busStops);
    });
}

const BusStopsService = {
  getAll,
  updateCache
};

export default BusStopsService;
