<template>
    <section class="registration">
      <div class="container">
        <div class="registration__inner">
          <h2 class="title">Регистрация</h2>
          <form @submit.prevent="registerUser">
            <label for="Имя">Имя</label>
            <input type="text" placeholder="Ваше имя" name="Имя" v-model="username">
            <label for="Пароль">Пароль</label>
            <input type="password" placeholder="Ваш пароль" name="Пароль" v-model="password">
            <span class="error" v-if="this.errorMessage !== ''">{{this.errorMessage}}</span>
            <div class="registration__privacy">
              <input type="checkbox" style="padding: 0;" v-model="policy">
              <p>Даю свое согласие на <a href="/src/assets/images/privacy.pdf" target="_blank" style="color: red;">Обработку персональных данных</a></p>
            </div>
            <Button :content="'Зарегистрироваться'" :type="'submit'" style="max-width: 100%;"/>
          </form>
        </div>
      </div>
    </section>
  </template>
  
  <script>
import Button from "/src/components/Button/Button.vue"
 import { mapMutations } from 'vuex'
 import { mapGetters } from 'vuex'
  import axios from 'axios'
  import { jwtDecode } from "jwt-decode";


  export default {
    components:{
      Button
    },
  data() {
    return {
      username: '',
      password: '',
      policy: '',
      errorMessage: '',
    };
  },
  computed:{

...mapGetters([
'TOKEN',

]),
},
  methods: {

    ...mapMutations([
      'unAuthorize',
      'authorize',
      'setUserName',
      'setUserId',
      'setToken',
    ]),
    ...mapGetters([
      'TOKEN',

    ]),
    async registerUser() {
      try {
        const response = await axios.post('http://localhost:3000/register', {
          username: this.username,
          password: this.password,
          policy: this.policy,
        });
        
        this.errorMessage = '';
        alert('Вы были успешно зарегистрированы!'); 
        const login = await this.login();
      } catch (error) {
        if(error.response && error.response.data && error.response.data.error){
          this.errorMessage = error.response.data.error;
        }
        else{
          alert('Ошибка при регистрации')
          this.errorMessage = error.response.data.error;
        }
      }
    },
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          username: this.username,
          password: this.password,
          
        });
        const token = response.data.token;
        const decodedToken = jwtDecode(token);

        this.setToken(token)
        this.authorize();
        this.setUserName(this.username); 
        this.setUserId(decodedToken.userId);

        alert('Вы успешно авторизовались!')
        this.$router.push('/');
       
      } catch (error) {
        if(error.response && error.response.data && error.response.data.error){
          this.errorMessage = error.response.data.error;
        }else{
          alert('Ошибка авторизации')
        }
      }
    }
  },
};
  </script>