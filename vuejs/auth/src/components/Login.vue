<script>
import { auth } from "../apis/base.js"

export default {
  data() {
    return {
      username: "",
      password: ""
    }
  },
  methods: {
    login: function() {
      auth(this.username, this.password).then(function () {
          window.location = "#/";
      });
    },
  },
}

</script>

<template>
  <form method="POST" @submit.prevent="login">
      <input type="text" name="username" v-model="username">
      <input type="password" name="password" v-model="password">
      <button type="submit" value="submit">Login</button>
  </form>
</template>

