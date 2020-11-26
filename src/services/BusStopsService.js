import http from "../http-common";

const getAll = () => {
  return http.get("/bus-stops");
}

export default {
  getAll
};
