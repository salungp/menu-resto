<template>
	<v-layout
		column>
		<Breadcrumbs :items="breadcrumbItems"/>

		<div v-if="isLoading">Loading...</div>

		<div v-else>
			<v-list>
				<v-list-item
					v-for="item in cart"
					:key="Math.random()">
					<v-list-item-icon>
						<v-btn
							icon
							@click="deleteCart(item[0].code)"
							color="red">
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</v-list-item-icon>

					<v-list-item-content>
	          <v-list-item-title v-text="item[1].title"></v-list-item-title>
	          <small class="mt-2" style="opacity: .7">Total : {{ item[0].total }}</small>
	        </v-list-item-content>

	        <v-list-item-avatar>
	          <v-img :src="item[1].menu_image"></v-img>
	        </v-list-item-avatar>
				</v-list-item>
			</v-list>

			<v-card class="mt-3">
				<v-card-subtitle>Harga keseluruhan</v-card-subtitle>
				<v-card-text class="pb-5">
					<h1>Rp. {{ priceTotal | setPrice }}</h1>
				</v-card-text>
			</v-card>
		</div>

	</v-layout>
</template>

<script>
import Breadcrumbs from '../components/Breadcrumbs'
import axios from 'axios'

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
					text: 'Cart',
					disabled: true,
					href: '/cart'
				}
			],

			isLoading: true,

			menuData: []
		}
	},

	methods: {
		deleteCart(code) {
			this.$store.commit('cart/delete', code)
		}
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

  computed: {
		items() {
			return this.$store.state.cart.lists
		},

		cart() {
			let result = []
			let row = []
			this.items.forEach(item => {
				this.menu.forEach(list => {
					if (parseInt(item.id) === parseInt(list.id)) {
						row = [item, list]
					}
				})
				result.push(row)
			})

			return result
		},

		priceTotal() {
			let priceTotal = 0
			this.cart.forEach(item => {
				priceTotal += (parseInt(item[1].price) * parseInt(item[0].total))
			})
			return priceTotal
		},

		menu() {
			return this.$store.state.menu.lists
		}
	},

	created() {
		axios.get('http://localhost/perpustakaan-online-api/menu')
      .then(res => {
        this.$store.dispatch('menu/getMenu', res.data)
        this.isLoading = false
      }).catch(error => {
        console.log(error)
    })
    this.$store.commit('layout/setByProp', { prop: 'searchBar', value: false })
    this.$store.commit('layout/setByProp', { prop: 'title', value: 'Cart' })
	},

	components: {
		Breadcrumbs
	},

	head: {
		title: 'Menu cart'
	}
}
</script>