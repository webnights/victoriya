

import { createApp } from 'vue'
import { createStore } from 'vuex'

import App from './App.vue'
import router from './router'
import VueTheMask from 'vue-the-mask'
import createPersistedState from 'vuex-persistedstate'
import './assets/style.scss'
const app = createApp(App)


 
const store = createStore({
    plugins: [createPersistedState()],
    state () {
      return {
        isAuthorized: false,
        username: '',
        userId: '',
        token: '',
        cartSize: 0,
        cartCost: 0,
        cart: [],
      }
    },
    mutations: {
      unAuthorize(state){
        state.isAuthorized = false;
      },
      authorize(state){
        state.isAuthorized = true;
      },
      setUserName(state, name){
        state.username = name;
      },
      setUserId(state, id){
        state.userId = id;
      },
      setToken(state, token){
        state.token = token;
      },
      setCartSize(state,size){
        state.cartSize = size;
      },
      setCart(state, cart){
        state.cart = cart;
      },
      setCartCost(state, cost){
        state.cartCost = cost;
      }
    },
    getters:{
        ISAUTHORIZED(state){
            return state.isAuthorized
        },
        USERNAME(state){
            return state.username;
        },
        USERID(state){
          return state.userId;
        },
        TOKEN(state){
          return state.token;
        },
        CARTSIZE(state){
          return state.cartSize;
        },
        CART(state){
          return state.cart;
        },
        CARTCOST(state){
          return state.cartCost;
        }
    }
  })


app.use(router);
app.use(VueTheMask);
app.use(store)

app.mount('#app')