<template>
  <div id="app">
   <div class="wrapper">
      <Header />
      <RouterView />
      <Footer />
   </div>
  </div>
</template>

<script>
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'

export default {
  components:{Header, Footer}
  
}
</script>