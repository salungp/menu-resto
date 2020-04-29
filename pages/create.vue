<template>
	<v-layout
		column>
		<Breadcrumbs :items="breadcrumbItems"/>
		<v-row>
			<v-col cols="6">
				<v-alert
					v-if="alert.status"
		      text
		      :type="alert.type"
		    >
		      {{ alert.message }}
		    </v-alert>
				<v-form
					ref="form"
					v-model="valid"
					@submit.prevent="createMenu">
					<v-text-field
						label="Title"
						:rules="[v => !!v || 'Title is required']"
						v-model="title"
						required/>

					<v-text-field
						label="Price"
						type="number"
						:rules="priceRules"
						v-model="price"
						required/>

					<v-select
						label="Category"
						:items="category"
						v-model="category"
						required/>

					<v-text-field
						label="Image link"
						v-model="menu_image"
						required/>

					<v-btn
						type="submit"
						:loading="loading"
						:disabled="!valid || loading"
						color="primary">Save</v-btn>
				</v-form>
			</v-col>
		</v-row>
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
					text: 'Menus',
					disabled: false,
					href: '/'
				},
				{
					text: 'Create',
					disabled: true,
					href: '/create'
				}
			],

			loader: null,
			loading: false,
			title: '',
			price: '',
			category: '',
			menu_image: '',

			alert: {
				status: false
			},
			category: ['food', 'drink', 'junkfood'],
			valid: true,
			priceRules: [
				v => !!v || 'Price is required',
				v => (parseInt(v) <= 1000000 && parseInt(v) >= 10000) || 'Price must between 10.000 - 1.000.000',
			]
		}
	},

	created() {
		this.$store.commit('layout/setByProp', { prop: 'searchBar', value: false })
		this.$store.commit('layout/setByProp', { prop: 'title', value: 'Create menu' })
	},

	components: {
		Breadcrumbs
	},

	watch: {
		loader() {
			let l = this.loader
			this[l] = !this[l]

			this.loader = null
		}
	},

	methods: {
		createMenu() {
			this.loader = 'loading'

			let formData = new FormData()
			formData.append('title', this.title)
			formData.append('price', this.price)
			formData.append('category', this.category)
			formData.append('menu_image', this.menu_image)

			axios.post('http://localhost/perpustakaan-online-api/menu/create', formData).then(res => {
					this.alert = {
						status: true,
						type: 'success',
						message: res.data.message
					}
					this.loading = false
					this.loader = null
				}).catch(error => {
					console.log(error)
					this.loading = false
					this.loader = null
			})
		}
	},

	head: {
		title: 'Create menu'
	}
}
</script>