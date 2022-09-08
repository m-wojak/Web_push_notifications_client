import http from "../http-common";
class NotificationDataService {
  getAll() {
    return http.get(`/notification`);
  }
  get(id) {
    return http.get(`/notification/${id}`);
  }
  create(data) {
    return http.post(`/notification`, data);
  }
  update(id, data) {
    return http.put(`/notification/${id}`, data);
  }
  delete(id) {
    return http.delete(`/notification/${id}`);
  }
  deleteAll() {
    return http.delete(`/notification`);
  }
  findByTopic(topic) {
    return http.get(`/notification/${topic}`);
  }
}
export default new NotificationDataService();