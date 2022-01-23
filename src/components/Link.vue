<template>
    <router-link :to="link" class="font-bold dark:text-slate-200">
        {{name}}
    </router-link>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name:'Link',
    props:{
        link:String,
        name:String
    }
})
</script>