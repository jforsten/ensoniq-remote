export default {
  namespaced: true,

  state: {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@morningstar.com'
  },

  getters: {
    fullname: state => `${state.firstname} ${state.lastname} ${state.email}`
  },

  mutations: {
    updatemail (state, email) {
      state.email = email
    }
  },

  actions: {
    emailupdate (context, email) {
      context.commit('updatemail', email)
    }
  }
}
