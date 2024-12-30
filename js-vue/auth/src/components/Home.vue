<script>
import { isAuth } from '../apis/base.js'

export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    isAuthenticated() {
      return isAuth();
    }
  }
}
</script>


<template>
  <div>
    <h1>Home</h1>
    <p>
      {{isAuthenticated ? "authenticated" : "anonymous"}}
    </p>
  </div>
</template>
