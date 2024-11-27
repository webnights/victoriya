<template>
    <div class="carousel__item">
         <img :src="item.image" alt="">
    </div>
   </template>   
   
   <script>
 
   export default {
    props:{
     item:{
         type: Object,
    
     }
    }
     
   }
   
   </script>