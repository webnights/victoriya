<template>
    <input :type="type" :placeholder="placeholder" class="input">
  </template>
  
  <script>
    export default{
        props:{
        type:{
            type: String,
            required: true,
        },
        placeholder:{
            type: String,
            required: true
        }
    }
    }
    
  </script>
  <style scoped lang="scss">
    input{
        padding: 15px;
        
        width: 100%;
    }
    
    
  </style>