<template>
  <div class="p-5 w-max mx-auto">
    <router-link to="/" class="font-bold">Home</router-link> |
    <router-link to="/about" class="font-bold">About me</router-link> |
    <span class="hidden md:inline"><router-link to="/snake" class="font-bold">Snake</router-link> | </span>
    <router-link to="/links" class="font-bold">Links</router-link>
  </div>
  <router-view class="font-sans antialiased text-gray-600"/>
</template>
<script>
import { onMounted } from '@vue/runtime-core'

export default {
  setup(){
    onMounted(() => {
      fetch('log_visit', {method: 'POST',})
    })
  }
}
</script>