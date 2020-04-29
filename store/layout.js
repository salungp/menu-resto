export const state = () => ({
	theme: '',
	searchBar: true,
	title: 'Resto app'
})

export const mutations = {
	setByProp(state, payload) {
		state[payload.prop] = payload.value
	}
}