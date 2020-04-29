<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="layoutConfig.title" />
      <v-spacer />

      <v-form v-if="layoutConfig.searchBar"
        ref="form"
        class="pt-2"
        @submit.prevent="searchMenu">
        <v-text-field
          class="mt-4 mr-5"
          v-model="searchKey"
          append-icon="mdi-magnify"
          solo
          dense/>
      </v-form>

      <nuxt-link style="text-decoration: none;" to="/cart">
        <v-btn icon>
          <v-badge
            color="red"
            :content="cartTotal"
            left
          >
            <v-icon>mdi-cart</v-icon>
          </v-badge>
        </v-btn>
      </nuxt-link>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/'
        },
        {
          icon: 'mdi-pencil',
          title: 'Create',
          to: '/create'
        },
        {
          icon: 'mdi-table',
          title: 'Menu table',
          to: '/table'
        }
      ],
      category: ['food', 'junkfood', 'drink'],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Resto app',
      searchKey: '',
    }
  },

  computed: {
    cartTotal() {
      return this.$store.state.cart.lists.length
    },

    layoutConfig() {
      return this.$store.state.layout
    }
  },

  created() {
    this.$store.commit('cart/get')
  },

  methods: {
    searchMenu() {
      axios.get('http://localhost/perpustakaan-online-api/menu/search/' + this.searchKey)
        .then(res => {
          this.$store.dispatch('menu/replaceMenu', res.data)
        }).catch(error => {
          console.log(error)
      })
      console.log(this.cartTotal)
    }
  }
}
</script>
