export const state = () => ({
	lists: [],
	key: 'cart'
})

export const mutations = {
	add(state, payload) {
		let current = JSON.parse(localStorage.getItem(state.key)) || []
		current.push(payload)

		state.lists = current

		localStorage.setItem(state.key, JSON.stringify(state.lists))
	},

	delete(state, payload) {
		let current = JSON.parse(localStorage.getItem(state.key))
		let filtered = []

		// if payload is array
		if (typeof payload === 'object') {
			for (let i = 0; i < payload.length; i++) {
				current.forEach(item => {
					if (item.id !== payload[i]) {
						filtered.push(item)
					}
				})
			}

			// save to state
			state.lists = filtered
		} else {			
			state.lists = current.filter(item => item.code !== payload)
		}

		localStorage.setItem(state.key, JSON.stringify(state.lists))
	},

	get(state) {
		state.lists = JSON.parse(localStorage.getItem(state.key)) || []
	}
}

export const actions = {
	add({ commit }, payload) {
		commit('add', payload)
	}
}