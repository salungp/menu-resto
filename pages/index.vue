<template>
  <v-layout
    column
  >
    <Breadcrumbs :items="breadcrumbItems"/>
    <v-snackbar
      v-model="snackbar.status">
      {{ snackbar.text }}
      <v-btn
        text
        color="pink"
        @click="snackbar.status = false">close</v-btn>
    </v-snackbar>

    <v-row v-if="isLoading">
      <!-- If data during fetched -->
      <div
        class="col-md-3"
        :key="index"
        v-for="(list, index) in skeleton">
        <v-skeleton-loader
          class="mx-auto"
          max-width="300"
          type="image, list-item, card-heading, actions"
        ></v-skeleton-loader>
      </div>
    </v-row>

    <v-row v-else>
      <!-- Data menu -->
      <div
        class="col-md-3 col-sm-6"
        :key="list.id"
        v-for="list in menu">
        <v-card>
          <v-img
            :src="list.menu_image"
            style="height: 200px; object-fit: cover;">
          </v-img>
          <v-card-subtitle>{{ list.title }} <span class="dot"></span> {{ list.category }}</v-card-subtitle>
          <v-card-text>
            <h1>Rp. {{ list.price | setPrice }}</h1>
          </v-card-text>
          <v-card-actions style="padding-bottom: 20px;">
            <nuxt-link style="text-decoration: none;" :to="/detail/ + list.id">
              <v-btn
                text
                color="primary">Buy</v-btn>
            </nuxt-link>
            <v-btn
              dark
              @click="addToCart(list.id)"
              color="primary">Add to cart</v-btn>
          </v-card-actions>
        </v-card>
      </div>

    </v-row>
  </v-layout>
</template>

<script>
import Breadcrumbs from '../components/Breadcrumbs'
import axios from 'axios'
import randomstring from 'randomstring'

export default {
  data() {
    return {
      breadcrumbItems: [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/'
        },
        {
          text: 'Menus',
          disabled: true,
          href: '/'
        }
      ],

      // loading status
      isLoading: true,

      skeleton: [1, 2, 3, 4, 5, 6, 7, 8],

      snackbar: {
        status: false
      }
    }
  },

  methods: {
    addToCart(id) {
      this.$store.dispatch('cart/add', {
        id: id,
        code: randomstring.generate(7),
        total: 1
      })
      this.snackbar = {
        status: true,
        text: 'Product masuk ke keranjang.'
      }
    }
  },

  computed: {
    menu() {
      return this.$store.state.menu.lists
    }
  },

  created() {
    axios.get('http://localhost/perpustakaan-online-api/menu')
      .then(res => {
        this.$store.commit('menu/get', res.data)
        this.isLoading = false
      }).catch(error => {
        console.log(error)
    })

    this.$store.commit('layout/setByProp', { prop: 'searchBar', value: true })
    this.$store.commit('layout/setByProp', { prop: 'title', value: 'Resto app' })
  },

  components: {
    Breadcrumbs
  },

  filters: {
    setPrice(price) {
      let numberString = price.toString(),
          sisa = numberString.length % 3,
          rupiah = numberString.substr(0, sisa),
          ribuan = numberString.substr(sisa).match(/\d{3}/gi)

      if (ribuan) {
        let separator = sisa ? '.' : ''
        rupiah += separator + ribuan.join('.')
      }

      return rupiah
    }
  },

  head: {
    title: 'Welcome to'
  }
}
</script>

<style>
  .need-overlay {
    position: relative;
  }

  .need-overlay::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80%;
    background: linear-gradient(to top, rgba(0,0,0,.8), rgba(0,0,0,.0));
  }

  .dot {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #666;
    margin: 0 5px 2px 5px;
  }
</style>
