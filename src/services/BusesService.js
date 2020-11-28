import http from "../http-common";
import { Service } from "../services/DbService";

const getAll = () => {
  return http.get("/buses");
}

const updateCache = () => {
  return getAll()
    .then(response => {
      Service.putAllBuses(response.data.buses);
    });
}

export default {
  getAll,
  updateCache
};
