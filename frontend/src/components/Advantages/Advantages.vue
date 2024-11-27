<template>
    <section class="advantages">
        <div class="container">
            <div class="advantages__inner">
                <ul class="advantages__cards">
                    <AdvantageCard v-for="(item, index) in info" :key="index" :info = "item"/>
                </ul>
            </div>
        </div>
    </section>
</template>
<script>
    import AdvantageCard from "/src/components/AdvantageCard/AdvantageCard.vue"
    import dataJson from "/src/assets/data/Data.json"
    import axios from 'axios';
     export default{
         components:{
             AdvantageCard
         },
         data(){
             return{
                 info: []
             }
         },
         methods:{
             async getAdvantages(){
 
                 try{
                     const response = await axios.get('http://localhost:3000/');
                     this.info = response.data
                 }catch(error)
                 {
                     console.log(error, 'Произошла ошибка при взятии данных из таблицы Advantages')
                 }
                     
                 }
         },
         mounted(){
             this.getAdvantages();   
         }
        
     }
 </script>