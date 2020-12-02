import http from "../http-common";
import axios from 'axios';

const get = id => {
  return http.get(`/arrival/${id}`);
}

const getAll = idList => {
  const requests = idList.map(id => {
    return get(id);
  });
  return axios.all(requests);
}

const ArrivalService = {
  get,
  getAll
};

export default ArrivalService;
