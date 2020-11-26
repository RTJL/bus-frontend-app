import http from "../http-common";

const getAll = () => {
  return http.get("/buses");
}

export default {
  getAll
};
