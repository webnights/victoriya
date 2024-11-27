<template>
  <section class="product__page">
    <div class="container">
      <div class="product__inner">
        <div class="product__info">
          <img :src="`${product.image}`" alt="" />
          <div class="product__content">
            <div>
              <label for="product__name">Тур:</label>
              <h2 class="product__name">Москва - {{ product.name }}</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <td>Категория</td>
                  <td>Цена</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in product.params" :key="index">
                  <td>{{ item.param }}</td>
                  <td>{{ item.value }}</td>
                </tr>
              </tbody>
            </table>
            <div class="cart_info">
              <label
                >Стоимость:
                <h2 class="price" style="margin-top: 10px">
                  {{ " " + product.price + " " + "₽" }}
                </h2></label
              >
              <label v-if="ISAUTHORIZED"
                >Количество:
                <input
                  type="number"
                  min="1"
                  class="quantity"
                  v-model="quantity"
                  @input="validate($event)"
              /></label>
              <button @click="addToCart" class="button" v-if="ISAUTHORIZED">
                Добавить в корзину
              </button>
              <span v-if="!ISAUTHORIZED" class="please_login"
                >Зарегистрируйтесь, чтобы добавить товар в корзину</span
              >
            </div>
          </div>
        </div>
        <div class="product__description">
          <label for="product__days">Описание поездки:</label>
          <div class="product__days">
            <label for="tourday">Первый день</label>
            <p class="first tourday">{{ product.first_day }}</p>
            <label for="tourday">Второй день</label>
            <p class="second tourday">{{ product.second_day }}</p>
          </div>
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
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      products: [],
      quantity: 1,
    };
  },
  methods: {
    ...mapMutations(["setCartSize"]),
    async getProducts() {
      const response = await axios.get("http://localhost:3000/products");
      this.products = response.data;
    },

    async addToCart() {
      const body = {
        user_id: this.USERID,
        cart_id: this.USERID,
        product_id: this.id,
        quantity: this.quantity,
      };
      try {
        const response = await axios.post("http://localhost:3000/cart", body);
        this.updateTotalQuantity();
        alert(response.data.message);
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
    async updateTotalQuantity() {
      const userId = this.USERID;
      const response = await axios.get(`http://localhost:3000/cart/${userId}`);
      const total = response.data.reduce((acc, item) => {
        return acc + item.product_quantity;
      }, 0);
      this.setCartSize(total);
    },
    validate($event) {
      if ($event.target.value < 1) {
        $event.target.value = 1;
      }
    },
  },
  computed: {
    ...mapGetters(["USERID", "ISAUTHORIZED"]),
    product() {
      const result = this.products.find((product) => product.id == this.id);
      return result;
    },
  },
  beforeMount() {
    this.getProducts();
  },
};
</script>
