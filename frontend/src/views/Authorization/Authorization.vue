<template>
  <section class="authorization">
    <div class="container">
      <div class="authorization__inner">
        <h2 class="title">Авторизация</h2>
        <form @submit.prevent="login()">
          <label
            >Имя<input
              type="text"
              placeholder="Введите ваше имя"
              v-model="username"
          /></label>
          <label
            >Пароль<input
              type="password"
              placeholder="Введите ваш пароль"
              v-model="password"
          /></label>
          <span class="error" v-if="this.errorMessage !== ''">{{
            this.errorMessage
          }}</span>
          <Button :content="'Войти'" :type="'submit'" style="max-width: 100%" />
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import Button from "/src/components/Button/Button.vue";
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
export default {
  components: {
    Button,
  },
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  computed: {
    ...mapGetters(["TOKEN", "USERID"]),
  },
  methods: {
    ...mapMutations([
      "unAuthorize",
      "authorize",
      "setUserName",
      "setUserId",
      "setToken",
      "setCartSize",
      "setCart",
    ]),
    async login() {
      try {
        const response = await axios.post("http://localhost:3000/login", {
          username: this.username,
          password: this.password,
        });
        const token = response.data.token;
        const decodedToken = jwtDecode(token);

        this.setToken(token);
        this.authorize();
        this.setUserName(this.username);
        this.setUserId(decodedToken.userId);
        await this.getCart();
        await this.updateTotalQuantity();
        alert("Вы успешно авторизовались!");
        this.$router.push("/");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          this.errorMessage = error.response.data.error;
        } else {
          alert("Ошибка авторизации");
        }
      }
    },
    async getCart() {
      const userId = this.USERID;
      const response = await axios.get(`http://localhost:3000/cart/${userId}`);
      this.setCart(response.data);
    },
    async updateTotalQuantity() {
      const userId = this.USERID;
      const response = await axios.get(`http://localhost:3000/cart/${userId}`);
      const total = response.data.reduce((acc, item) => {
        console.log(item);
        return acc + item.product_quantity;
      }, 0);
      this.setCartSize(total);
    },
  },
};
</script>
