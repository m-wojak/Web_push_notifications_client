import http from "../http-common";
class SubscriberDataService {
  getAll() {
    return http.get(`/subscribers`);
  }
  get(topic) {
    return http.get(`/subscribers/topic/${topic}`);
  }
  create(data) {
    return http.post(`/subscribers`, data);
  }
  update(token, data) {
    return http.put(`/subscribers/token/${token}`, data);
  }
  delete(token) {
    return http.delete(`/subscribers/token/${token}`);
  }
  deleteAll() {
    return http.delete(`/subscribers`);
  }
  findAllByTopic(topic) {
    return http.get(`/subscribers/topic/${topic}`);
  }
}
export default new SubscriberDataService();
