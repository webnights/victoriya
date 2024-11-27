<template>
  <header>
    <div class="container">
      <div class="header__inner">
        <div class="search" ref="searchWrapper">
          <img src="/src/assets/images/search.svg" alt="" />
          <input
            type="text"
            placeholder="Найти нужный вам тур"
            v-model="searchString"
            @input="searchProducts"
            @focus="searchProducts"
            @keydown.esc="closeSearchDropdown"
            @keydown.down="navigateSearchDropdown('down')"
            @keydown.up="navigateSearchDropdown('up')"
            @keydown.enter="handleEnterKey"
          />
          <div
            class="search__products"
            v-if="searchString.length !== 0 && showSearchDropdown"
            ref="searchDropdown"
          >
            <div
              v-for="(searchProduct, index) in searchProductsList"
              :key="index"
              :class="{ 'active-search-item': activeSearchIndex === index }"
            >
              <RouterLink
                :to="`/product/${searchProduct.id}`"
                class="product__list-link"
                >{{ searchProduct.name }}</RouterLink
              >
            </div>
          </div>
        </div>
        <RouterLink class="header__logo" to="/">
          <img :src="Logo" alt="" />
        </RouterLink>
        <div class="header__row">
          <div class="header__user">
            <div class="user__data" v-if="ISAUTHORIZED">
              <div style="margin-right: 20px">
                <img src="/src/assets/images/header_logos/user.svg" alt="" />
                <span>{{ USERNAME }}</span>
              </div>
              <RouterLink
                class="cart_link"
                v-if="ISAUTHORIZED"
                :to="`/cart/${USERID}`"
              >
                <div class="cart__icon">
                  <i>{{ CARTSIZE }}</i>
                  <img src="/src/assets/images/header_logos/cart.svg" alt="" />
                </div>
              </RouterLink>
              <div class="logout" @click="logout" style="cursor: pointer">
                <img src="/src/assets/images/header_logos/logout.svg" alt="" />
              </div>
            </div>
            <RouterLink to="/authorization" v-if="!ISAUTHORIZED">
              <article>Войти</article>
            </RouterLink>

            <RouterLink to="/registration" v-if="!ISAUTHORIZED"
              ><article>Регистрация</article></RouterLink
            >

            <RouterLink
              to="/comment"
              :style="ISAUTHORIZED ? 'min-width:200px' : ''"
            >
              <article>Оставить отзыв</article>
            </RouterLink>
          </div>
        </div>
      </div>
      <nav>
        <RouterLink to="/" class="nav__item"><span>Главная</span></RouterLink>
        <RouterLink to="/products" class="nav__item"
          ><span>Туры</span></RouterLink
        >
        <RouterLink to="/contact" class="nav__item"
          ><span>Контакты</span></RouterLink
        >
        <RouterLink to="/team" class="nav__item"
          ><span>Способы оплаты</span></RouterLink
        >
        <a href="https://www.viktur.ru/" target="_blank" class="nav__item"
          >Наш второй сайт</a
        >
      </nav>
    </div>
  </header>
</template>
<script>
  import Logo from "/src/assets/images/logo.svg";
  import Button from "/src/components/Button/Button.vue";
  import axios from "axios";
  import { mapGetters } from "vuex";
  import { mapMutations } from "vuex";
  export default {
    components: {
      Button,
    },
    data() {
      return {
        Logo: Logo,
        products: [],
        searchString: "",
        searchProductsList: [],
        showSearchDropdown: false,
        activeSearchIndex: -1,
        username: "",
      };
    },
    mounted() {
      this.getProducts();
      document.addEventListener("click", this.handleOutsideClick);
    },
    beforeUnmount() {
      document.removeEventListener("click", this.handleOutsideClick);
    },
    methods: {
      ...mapMutations(["unAuthorize", "setCart"]),
      searchProducts() {
        this.searchProductsList = this.products.filter((product) => {
          return (
            String(product.name.trim().toLowerCase()).indexOf(
              String(this.searchString.trim().toLowerCase())
            ) !== -1
          );
        });
        this.showSearchDropdown = true;
        this.activeSearchIndex = 0; // Выделить первый элемент при поиске
      },
      closeSearchDropdown() {
        this.showSearchDropdown = false;
        this.activeSearchIndex = -1;
      },
      handleOutsideClick(event) {
        if (
          !this.$refs.searchWrapper.contains(event.target) &&
          this.showSearchDropdown
        ) {
          this.closeSearchDropdown();
        }
      },
      navigateSearchDropdown(direction) {
        if (direction === "down") {
          this.activeSearchIndex =
            (this.activeSearchIndex + 1) % this.searchProductsList.length;
        } else if (direction === "up") {
          this.activeSearchIndex =
            (this.activeSearchIndex - 1 + this.searchProductsList.length) %
            this.searchProductsList.length;
        }
      },
      handleSearchItemClick(productId) {
        // Переход на страницу продукта и закрытие списка
        this.$router.push(`/product/${productId}`);
        this.closeSearchDropdown();
      },
      handleEnterKey() {
        if (this.showSearchDropdown && this.activeSearchIndex !== -1) {
          const selectedProductId =
            this.searchProductsList[this.activeSearchIndex].id;
          this.$router.push(`/product/${selectedProductId}`);
          this.closeSearchDropdown();
        }
      },
  
      logout() {
        this.unAuthorize();
        this.$router.push("/authorization");
      },
      async getProducts() {
        const response = await axios.get("http://localhost:3000/products");
        this.products = response.data;
      },
    },
    computed: {
      ...mapGetters(["ISAUTHORIZED", "USERNAME", "USERID", "CARTSIZE"]),
    },
  };
  </script>