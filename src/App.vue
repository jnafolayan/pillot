<template>
  <div id="app">
    <navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'app',
  components: { Navbar }
};
</script>

<style lang="scss">
#app {
  // font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  width: 100vw;
  min-height: 100vh;
  
  @media (min-width: 992px) { 
    box-shadow: 0 2px 4px rgba(40, 40, 40, 0.3);
    margin: 40px auto;
    max-width: 767px;
  }
}
</style>
