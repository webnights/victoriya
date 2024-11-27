<template>
    <div class="advantage__card">
        <img :src="info.image" alt="Изображение">
        <h5>{{info.title}}</h5>
        <p>{{info.description}}</p>
    </div>
</template>
<script>

    import dataJson from "/src/assets/data/Data.json";
    export default{
       props:{
        info:{
            type: Object,
            required: true
        }
       }
    }
</script>
