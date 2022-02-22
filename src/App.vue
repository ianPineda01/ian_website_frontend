<template>
  <div class="p-5 w-max mx-auto dark:text-gray-50">
    <Link link="/" name="Home"/> |
    <Link link="/about" name="About me"/> |
    <span class="hidden md:inline">
      <Link link="/snake" name="Snake"/> | 
      <Link link="/minesweeper" name="Minesweeper"/> |
    </span>
    <Link link="links" name="Links"/>
  </div>
  <router-view class="font-sans antialiased text-gray-600 dark:text-gray-50"/>
</template>
<script>
import { defineComponent, onMounted } from 'vue'
import Link from './components/Link.vue'

export default defineComponent({
  name: 'App',
  components:{
    Link
  },
  setup(){
    onMounted(() => {
      fetch('log_visit', {method: 'POST'}).catch(err => console.log(err))
    })
  }
})
</script>