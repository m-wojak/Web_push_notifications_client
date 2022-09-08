<template>
  <div class="container-xxl">

      <button  type="button" class="btn btn-dark py-3 mb-5 p-4 m-4 mx-4 box-shadow--16dp" @click="authenticate">Allow Citizen Capital Notifications</button>

      <button  type="button" class="btn btn-dark py-3 mb-5 p-4 m-4 mx-4 box-shadow--16dp" @click="deactivate">Stop Citizen Capital Notifications</button>

  </div>
</template>

<script>
// @ is an alias to /src
import { getAuth, signInAnonymously } from 'firebase/auth';
// import { getMessaging, onMessage, getToken } from 'firebase/messaging';
// import { onMessage, getToken, deleteToken } from 'firebase/messaging';
import { getToken, deleteToken } from 'firebase/messaging';
import messaging from  '@/firebase';
import SubscriberDataService from "../services/SubscriberDataService";

export default {
  name: 'HomeView',
  data() {
    return {
      subscriber: {
        token: "",
        topic: "General",
      },
      submitted: false,
      message : ''
    };
  },
  methods: {
    async authenticate() {
      console.log("authenticating")
      const auth = getAuth();
      signInAnonymously(auth)
        .then(() => {
          console.log("Signed In")
        })
        .catch((error) => {
          console.log("Error in authenticate, error.code: ",error.code, " error.message: ",error.message)
        });
      // await signInAnonymously(getAuth())
      this.activate()
    },
    async activate() {
      console.log("activating ")
      const token = await getToken(messaging, {
        vapidKey:
        'BJucvqtS7Nj5Ay_MzG6jG6Vv-j-ARP4kdoC1_xLvdUd6GArglZgV4vX-PdXEiEKjKbHouzbNYtpLJxDznkHMwlk'
      })
      if (token) {
        console.log("token obtained: ",token)
        this.saveSubscriber(token);
      } else {
        console.log("No token")
      }
    },
    async saveSubscriber(token) {
      console.log("Saving subscriber")
      var data = {
        token: token,
        topic: "General"
      };
      console.log(data);
      SubscriberDataService.create(data)
        .then(response => {
          console.log(response.data);
          this.message = 'Successfully saved subscriber!'
          if(!response.data) {
            this.message = 'There was a problem saving the subscriber!'
          } 
          console.log("Save Subscriber Message: ", this.message )
          this.submitted = true;
        })
        .catch(e => {
          console.log('Error saving subscriber ',e);
        });
    },
      async deactivate() {
        const currentToken = await getToken(messaging, {
        vapidKey:
        'BJucvqtS7Nj5Ay_MzG6jG6Vv-j-ARP4kdoC1_xLvdUd6GArglZgV4vX-PdXEiEKjKbHouzbNYtpLJxDznkHMwlk'
        })
        console.log("Current token for deletion: ",currentToken)
          SubscriberDataService.delete(currentToken)
          .then(response => {
            console.log("Deleted token from mongodb ",response.data);
          })
          .catch(e => {
            console.log('Error deleting subscriber from mongodb',e);
          });
        const deleted = await deleteToken(messaging, {
          vapidKey:
          'BJucvqtS7Nj5Ay_MzG6jG6Vv-j-ARP4kdoC1_xLvdUd6GArglZgV4vX-PdXEiEKjKbHouzbNYtpLJxDznkHMwlk'
        })
        if (deleted) {
          console.log("Token deleted successfully", deleted)
        } else {
          console.log("Problem deleting token")
        }
    },
  }
}
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