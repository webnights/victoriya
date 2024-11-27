<template>
    <section class="comment">
        <div class="container">
            
            <div class="comment__inner">
                <h2 class="title">Мы будем рады, если вы дадите нам обратную связь. Здесь вы можете оставить свой отзыв!</h2>
                <form @submit.prevent = "sendComment">
                    <div class="estimation">
                        <h5>Как вы нас оцениваете?</h5>
                        <label >Плохо<input type = "radio" name="radioButton" value="Плохо" v-model="estimation" /></label>
                        <label >Хорошо<input type = "radio" name="radioButton" value="Хорошо" v-model="estimation"/></label>
                        <label >Отлично<input type = "radio" name="radioButton" value="Отлично" v-model="estimation"/></label>
                        <label >Превосходно!<input type = "radio" name="radioButton" value="Превосходно!" v-model="estimation"/></label>
                       
                    </div>
                    <label>Ваш отзыв <textarea placeholder="Напишите ваш отзыв" v-model ="comment"></textarea></label>
                    <label>Имя<input type="text" placeholder="Введите ваше имя" v-model ="name"/></label>
                    <label>Телефон<input type="tel" placeholder="Введите ваш номер телефона" v-model = "tel" v-mask="'+7 (###)-###-##-##'"/></label>

                    <div class="comment__privacy">
                        <input type="checkbox" v-model = "privacy">
                        <p>Даю свое согласие на <a href="/src/assets/images/privacy.pdf" download="" style="color: red;">Обработку персональных данных</a></p>
                      
                    </div>
                    <span class="error" v-if="errorMessage !== ''">{{errorMessage}}</span>
                    <Button :content = "'Оставить отзыв'" :type="'submit'" style="max-width: 100%;"/>
                </form>
            </div>
        </div>
    </section>
  </template>
  
  <script>
  
  import Button from "/src/components/Button/Button.vue"
  import axios from 'axios'
  export default {
    components:{
       Button
    },
    data(){
        return{
            estimation: '',
            privacy: '',
            comment: '',
            name: '',
            tel: '',
            errorMessage: '',
        }
    },

    methods: {
        async sendComment(){
            const body = {
                estimation: this.estimation,
                comment: this.comment,
                name: this.name,
                tel: this.tel,
                privacy: this.privacy
            }
            try{
                console.log(body);
                const response = await axios.post("http://localhost:3000/comments", body);
                this.errorMessage = '';
                alert("Спасибо за ваш отызыв!");
            }
            catch(error)
            {
                if(error.response && error.response.data && error.response.data.error){
                    this.errorMessage = error.response.data.error;
                }
            }
          
        }
    }
    
  }
  </script>