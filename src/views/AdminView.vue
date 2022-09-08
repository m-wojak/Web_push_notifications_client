<template>
<div class="container" style="padding-top:30px;padding-bottom:10px">
  <div class="submit-form">
      <div class="form-group">
        <label for="topic"><strong>Topic</strong></label>
        <input
          type="text"
          class="form-control"
          id="topic"
          required
          v-model="notification.topic"
          name="topic"
        />
      </div>
      <div class="form-group">
        <label for="title"><strong>Title</strong></label>
        <input
          type="text"
          class="form-control"
          id="title"
          required
          v-model="notification.title"
          name="title"
        />
      </div>
      <div class="form-group">
        <label for="body"><strong>Body</strong></label>
        <textarea
          class="form-control"
          id="body"
          required
          v-model="notification.body"
          name="body"
          rows="6"
        ></textarea>
      </div>
      <button @click="sendNotification" class="btn btn-dark py-3 mb-5 p-4 m-4 mx-4 box-shadow--16dp">Send Notification to Topic Group</button>
      <p>{{ this.message }}</p>
      
  </div>
</div>
</template>

<script>
import NotificationDataService from "../services/NotificationDataService";
import SubscriberDataService from "../services/SubscriberDataService";
import FirebaseDataService from "../services/FirebaseDataService";

import _ from 'underscore';

export default {
  name: "AdminView",
  data() {
    return {
      notification: {
        id: null,
        topic: "General",
        title: "",
        body: "",
      },
      tokens: [],
      submitted: false,
      message: ""
    };
  },
  methods: {
    async sendNotification() {
        var data = {
          topic: this.notification.topic,
          title: this.notification.title,
          body: this.notification.body
        }
      console.log("data: ",data)
      await this.saveNotification(data);
      await this.retrieveTokens_by_topic(this.notification.topic);
      await this.subscribeUsersToTopic();
      await this.sendToFirebase(data);
    },
      //save notification to database for record keeping
      async saveNotification(data) {
        console.log("saving data",data)
        await NotificationDataService.create(data)
          .then(response => {
            console.log("Response from NotificationDataService.create(data) ",response);
            this.message = 'Successfully saved notification!'
            console.log("Save Notification Message: ", this.message )
            this.submitted = true;
            return response
          })
          .catch(error => {
            console.log("Save Notification Error: ",error);
            return error
          });
      },
      //get list of tokens to send notification to and subscribe list to current topic
      async retrieveTokens_by_topic(topic) {
        await SubscriberDataService.findAllByTopic(topic)
          .then(response => {
            const tokenProxy =  JSON.parse(JSON.stringify(_.pluck(response.data, 'token')))
            this.tokens = tokenProxy
            // const items = new Array()
            // for (var i = 0; i < tokenProxy.length; i++) {items.push(tokenProxy[i])}
            // console.log("tokenProxy: ",tokenProxy, typeof tokenProxy)
            // console.log("items: ",items, typeof items)
            // this.tokens = tokenProxy
            console.log("this.tokens: ",this.tokens, typeof this.tokens)
            return response
          })
          .catch(error => {
            console.log("Error in retrieveTokens_by_topic: ",error);
            return error
          });
      },
      async subscribeUsersToTopic() {
        //subscribe list of tokens to topic
        //firebase limit is 500 https://firebase.google.com/docs/database/usage/limits
        //send request to server
        var payload = {
          tokens: this.tokens,
          topic: this.notification.topic
        }
        console.log("Calling Firebase.subscribeUsersToTopicGroup ",payload)
        await FirebaseDataService.subscribeUsersToTopicGroup(payload)
          .then((response) => {
            // Response 
            console.log('Successfully subscribed users:', response);
            return response
          } )
          .catch((error) => {
            console.log('Error subscribing users:', error);
            return error
          });
        // var max_cnt = 500
        // console.log("tokens length: ",this.tokens.length)
        //   if (this.tokens.length <= max_cnt) {
        //     // console.log("messaging: ",messaging)
        //     console.log("data to firebase ",this.tokens, this.notification.topic)
        //     await getMessaging().subscribeToTopic(this.tokens, this.notification.topic)
        //     .then((response) => {
        //       // See the MessagingTopicManagementResponse reference documentation
        //       // for the contents of response.
        //       console.log('Successfully subscribed to topic:', response);
        //       return response
        //     })
        //     .catch((error) => {
        //       console.log('Error subscribing to topic:', error);
        //       return error
        //     });
        //   } else {
        //     var z = Math.floor(this.tokens.length/max_cnt);
        //     var remainder = this.tokens.length % max_cnt;
        //       if (remainder > 0) {var call_count = z + 1
        //       } else {
        //         call_count = z
        //       }
        //     for (var i = 0; i < call_count; i++) {
        //       var i_start = i * max_cnt
        //       if (i <= z) {
        //         var i_end = i_start + max_cnt
        //       } else {
        //         i_end = i_start + remainder
        //       }
        //       var token_slice = this.tokens.slice(i_start,i_end)
        //       await getMessaging().subscribeToTopic(token_slice, this.topic)
        //         .then((response) => {
        //           // See the MessagingTopicManagementResponse reference documentation
        //           // for the contents of response.
        //           console.log('Successfully subscribed to topic: i= ',i,' response = ', response);
        //           return response
        //         })
        //         .catch((error) => {
        //           console.log('Error subscribing to topic: i = ',i,' error = ', error);
        //           return error
        //         });
        //     }
        //   }
      },
      async sendToFirebase(data) {
        // const condition =  data.topic;

        // See documentation on defining a message payload.
        const message = {
          notification: {
            title: data.title,
            body: data.body
          },
          topic: data.topic
        };
        console.log("Calling Firebase.sendMessageToTopicGroup ",message)
        // Send a message to devices subscribed to the topic
        // specified by the provided condition.
        await  FirebaseDataService.sendMessageToTopicGroup(message)
          .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
            return response
          } )
          .catch((error) => {
            console.log('Error sending message:', error);
            return error
          });
      }
    },
  mounted() {
    console.log("mounted - Admin View")
    this.message = "";
  }
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.box-shadow--16dp {
    box-shadow: 0 16px 24px 2px rgba(0, 0, 0, .3), 0 6px 30px 5px rgba(0, 0, 0, .3), 0 8px 10px -5px rgba(0, 0, 0, .3)
}
</style>