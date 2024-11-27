<template>
    <section class="cart">
      <div class="container">
        <h2 class="title" v-if = "this.CARTSIZE === 0">Ваша корзина пока что пуста((</h2>
        <div class="cart__inner" v-if = "this.CARTSIZE > 0">
          <h2 class="title">Корзина</h2>
          <table>
            <thead>
              <tr>
                <td>Изображение товара</td>
                <td>Название товара</td>
                <td>Количество товара</td>
                <td>Стоимость 1 ед. товара</td>
                <td style="min-width: 200px;">Подытог</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in CART" :key="index" class="cart__item">
                <td><img :src="item.product_image" alt="" /></td>
                <td style="max-width: 400px;">
                  <span class="product__title">{{ item.product_name }}</span>
                </td>
                <td>
                  <div class="quantity">
                    <span
                      @click="updateQuantity(item, item.product_quantity + 1)"
                      class="noselect"
                      >+</span
                    >
                    <input
                      type="number"
                      :value="item.product_quantity"
                      min="1"
                      @change="onInputChange(item, $event.target.value)"
                    />
                    <span
                      @click="updateQuantity(item, item.product_quantity - 1)"
                      class="noselect"
                      >-</span
                    >
                  </div>
                </td>
                <td>
                  <div class="cart_product-price">
                    {{ item.product_price + " ₽" }}
                  </div>
                </td>
                <td>
                  <div class="cart_product-sum">
                    {{ item.product_price * item.product_quantity + " ₽" }}
                  </div>
                </td>
                <td @click="removeCartItem(item)">
                  <svg
                    fill="#000000"
                    width="30px"
                    height="30px"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    class="remove__item"
                  >
                    <path
                      d="M7.004 23.087l7.08-7.081-7.07-7.071L8.929 7.02l7.067 7.069L23.084 7l1.912 1.913-7.089 7.093 7.075 7.077-1.912 1.913-7.074-7.073L8.917 25z"
                    />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="cart__totals">
            <p>
              Общее количество товаров:<strong>{{
                "\u00A0\u00A0" + CARTSIZE
              }}</strong>
            </p>
            <p>
              Общая сумма: <strong>{{ "\u00A0\u00A0" + CARTCOST }} ₽</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import axios from "axios";
  import { mapGetters } from "vuex";
  import { mapMutations } from "vuex";
  export default {
    data() {
      return {
        cart: [],
        value: "",
      };
    },
    methods: {
      ...mapMutations(["setCart", "setCartSize", "setCartCost"]),
      async getCart() {
        const userId = this.USERID;
        const response = await axios.get(`http://localhost:3000/cart/${userId}`);
        this.setCart(response.data);
        this.updateTotalQuantity();
        this.updateCartCost();
      },
      async updateQuantity(item, newQuantity) {
        if(newQuantity < 1) return;
        const body = {
          user_id: this.USERID,
          cart_id: this.USERID,
          product_id: item.product_id,
          product_quantity: newQuantity,
        };
        try {
          const response = await axios.patch(`http://localhost:3000/cart/`, body);
          this.getCart();
        } catch (error) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            alert(error.response.data.error);
          } else {
            alert("Ошибка");
          }
        }
      },
      async onInputChange(item, newValue) {
        const newQuantity = parseInt(newValue);
        if (newQuantity < 1 || isNaN(newQuantity)) return;
        await this.updateQuantity(item, newQuantity);
      },
      updateCartCost() {
        const sum = this.CART.reduce((acc, item) => {
          return acc + item.product_price * item.product_quantity;
        }, 0);
        this.setCartCost(sum);
      },
      updateTotalQuantity() {
        const total = this.CART.reduce(
          (sum, item) => sum + item.product_quantity,
          0
        );
        this.setCartSize(total); // Обновляем общее количество товаров в Vuex
      },
      async removeCartItem(item) {
        try {
          const response = await axios.delete(`http://localhost:3000/cart`, {
            params: {
              user_id: this.USERID,
              product_id: item.product_id,
            },
          });
          this.getCart();
        } catch (error) {
          alert("Ошибка при отправке запроса");
        }
      },
    },
  
    computed: {
      ...mapGetters(["USERID", "CART", "CARTSIZE", "CARTCOST"]),
    },
    mounted() {
      this.getCart();
    },
  };
  </script>