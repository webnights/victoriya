<template>
    <section class="contacts">
        <div class="container">
            <div class="contacts__inner">
                <h2 class="title">Контакты</h2>
                <ul>
                    <ContactItem v-for = "(contact, index) in contacts" :key = "index" :contact = "contact"/>
                </ul>
                <p>
                    <strong >Как добраться: </strong>
                    Из центра Москвы двигаетесь по красной ветке метро до станции <em>"Красные Ворота"</em>. Выход из первого вагона из центра на Лермонтовский парк.

                    Переходите через дорогу на светофоре, и идете прямо, проходите сквер. Переходите дорогу по пешеходному переходу и поворачиваете налево, через сто метров перед вами будет небольшой железнодорожный мост.
                    
                    Сразу после моста поворачиваете направо и проходите 50 метров вдоль здания до подъезда №6. Заходите внутрь, поднимаетесь на 6 этаж в офис 95.</p>
                <div class="contacts__map">
                    <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3Ae8973fd69d8d42e7a0aa5aa5a432adf5c83a959a958992d4a0cc2cfe622e27a0&amp;source=constructor" width="1155" height="400" frameborder="0"></iframe>
                </div>
            </div>
        </div>
    </section>
 </template>
 <script>
    import axios from 'axios'
    import ContactItem from "/src/components/ContactItem/ContactItem.vue"
    export default{
        components:{
            ContactItem
        },
        data(){
            return{
                contacts: []
            }
        },
        methods:{
            async getContacts(){
                try{
                    const response = await axios.get("http://localhost:3000/contacts");
                    this.contacts = response.data;
                }
                catch(error)
                {
                    console.log(error, "Произошла ошибка при взятии данных из таблицы Контакты")
                }
            }
        }, 
        mounted(){
            this.getContacts();
        }
    }
 </script>
 