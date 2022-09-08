import http from "../http-common";
class FirebaseDataService {
  subscribeUsersToTopicGroup(data) {
    return http.put(`/firebase/subscribe`,data);
  }
  sendMessageToTopicGroup(data) {
    return http.put(`/firebase/send`,data);
  }
}
export default new FirebaseDataService();