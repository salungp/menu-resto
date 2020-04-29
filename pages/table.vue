<template>
	<v-layout
		column>
		<Breadcrumbs :items="breadcrumbItems"/>

		<v-alert
			v-if="alert.status"
      text
      :type="alert.type"
    >
      {{ alert.message }}
    </v-alert>

		<v-row>
			<div class="col-md-12">
				<v-btn
					color="red"
					:loading="loading"
					@click="deleteMenu"
					:disabled="checked.length < 1 || loading">
					<v-icon>mdi-delete</v-icon>
					Delete
				</v-btn>
			</div>
		</v-row>

		<v-card>
	    <v-card-title>
	      Menu
	      <v-spacer></v-spacer>
	      <v-text-field
	        v-model="search"
	        append-icon="mdi-magnify"
	        label="Search"
	        single-line
	        hide-details
	      ></v-text-field>
	    </v-card-title>
	    <v-data-table
	      :headers="headers"
	      :items="menu"
	      :search="search"
	    >
	    	<template v-slot:item.menu_image="{ item }">
		      <v-img width="100px" :src="item.menu_image"/>
		    </template>

		    <template v-slot:item.price="{ item }">
		      <div>Rp. {{ item.price | setPrice }}</div>
		    </template>

		    <template v-slot:item.action="{ item }">
		      <v-checkbox
		      	v-model="checked"
		      	:value="item.id"
			    ></v-checkbox>
		    </template>
	    </v-data-table>
	  </v-card>
	</v-layout>
</template>

<script>
import Breadcrumbs from '../components/Breadcrumbs'
import axios from 'axios'

export default {
	data() {
		return {
			loading: false,
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
					text: 'Table',
					disabled: true,
					href: '/table'
				}
			],
			alert: {
				status: false
			},
			search: '',
      headers: [
        {
          text: 'No',
          align: 'start',
          sortable: false,
          value: 'id',
        },
        { text: '#', value: 'action' },
        { text: 'Name menu', value: 'title' },
        { text: 'Price', value: 'price' },
        { text: 'Category', value: 'category' },
        { text: 'Menu image', value: 'menu_image' },
      ],

      checked: []
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
		menu() {
			return this.$store.state.menu.lists
		}
	},

	methods: {
		deleteMenu() {
			// set loading to indicate process
			this.loading = true

			let formData = new FormData()

			formData.append('id', this.checked)

			axios.post('https://salung.000webhostapp.com/menu/delete', formData)
				.then(res => {
					// update the state
					this.fetchData()

					// set alert
					this.alert = {
						status: true,
						type: 'success',
						message: res.data.message
					}

					// delete cart if use this data
					this.deleteCart()

					// disabled loading
					this.loading = false
					this.checked = []
				}).catch(error => {
					// set alert
					this.alert = {
						status: true,
						type: 'danger',
						message: error
					}

					this.loading = false
				})
		},

		fetchData() {
			axios.get('https://salung.000webhostapp.com/menu')
	      .then(res => {
	        this.$store.commit('menu/get', res.data)
	      }).catch(error => {
	        console.log(error)
	    })
		},

		// delete cart if use id checked
		deleteCart() {
			this.$store.commit('cart/delete', this.checked)
		}
	},

	created() {
		this.fetchData()
		this.$store.commit('layout/setByProp', { prop: 'searchBar', value: false })
		this.$store.commit('layout/setByProp', { prop: 'title', value: 'Menu table' })
	},

	head: {
		title: 'Menu table'
	},

	components: {
		Breadcrumbs
	}
}
</script>