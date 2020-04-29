<template>
	<v-layout
		column>
		<Breadcrumbs :items="breadcrumbItems"/>

		<div v-if="isLoading">Loading...</div>
		<div v-else>
			<v-alert
					v-if="alert.status"
		      text
		      :type="alert.type"
		    >
		      {{ alert.message }}
		    </v-alert>

			<v-card>
				<v-card-text>
					<v-img max-width="400px" :src="menu.menu_image"/>

					<h2 class="mt-4 mb-1">{{ menu.title }}</h2>
					<div>{{ menu.category }}</div>
				</v-card-text>

				<v-card-actions class="pb-4">
					<v-card>
						<v-btn small @click="total < 2 ? total : total--"><v-icon>mdi-minus</v-icon></v-btn>
						<v-btn small disabled>{{ total }}</v-btn>
						<v-btn small color="primary" @click="total++"><v-icon>mdi-plus</v-icon></v-btn>
					</v-card>
				</v-card-actions>

				<v-card-text>
					<div class="mb-1">Total</div>
					<h1>Rp. {{ totalPrice | setPrice }}</h1>
				</v-card-text>

				<v-card-actions class="pb-4">
					<v-btn @click="addToCart" color="success">Add to cart</v-btn>
				</v-card-actions>
			</v-card>
		</div>
	</v-layout>
</template>

<script>
import Breadcrumbs from '../../components/Breadcrumbs'
import axios from 'axios'
import randomstring from 'randomstring'

export default {
	validate ({ params }) {
    // Must be a number
    return /^\d+$/.test(params.id)
  },

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
					disabled: false,
					href: '/'
				},
				{
					text: 'Detail',
					disabled: true,
					href: '/'
				}
			],

			menu: [],

			total: 1,

			alert: {
				status: false
			},

			isLoading: true
		}
	},

	computed: {
		totalPrice() {
			return this.total * this.menu.price
		}
	},

	components: {
		Breadcrumbs
	},

	created() {
		axios.get('http://localhost/perpustakaan-online-api/menu/' + this.$route.params.id)
			.then(res => {
				this.menu = res.data
				this.isLoading = false
			}).catch(error => {
				console.log(error)
				this.isLoading = false
		})

	  this.$store.commit('layout/setByProp', { prop: 'searchBar', value: false })
	  this.$store.commit('layout/setByProp', { prop: 'title', value: 'Cart' })
	},

	methods: {
		addToCart() {
			this.$store.dispatch('cart/add', {
				id: this.menu.id,
				code: randomstring.generate(7),
				total: this.total
			})

			this.alert = {
				status: true,
				type: 'success',
				message: 'Product added'
			}
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
}
</script>