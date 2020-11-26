import http from "../http-common";

const get = id => {
  return http.get(`/arrival/${id}`);
}

export default {
  get
};
