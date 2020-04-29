import axios from 'axios'

export const state = () => ({
	lists: []
})

export const mutations = {
	get(state, payload) {
		state.lists = payload
	},

	replace(state, payload) {
		state.lists = payload
	}
}

export const actions = {
	getMenu({ commit }, payload) {
		commit('get', payload)
	},

	replaceMenu({ commit }, payload) {
		commit('replace', payload)
	}
}