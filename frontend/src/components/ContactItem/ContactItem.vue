<template>
    <div class="contact__item">
        <img :src="contact.image" alt="">
        <a :href="contact.url">{{contact.text}}</a>
    </div>
 </template>
 <script>
    
    export default{
       props:{
        contact:{
            type: Object,
            required: true
        }
       }
    }
 </script>
 