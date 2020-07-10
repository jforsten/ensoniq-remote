import store from '../store/'

export const Error = {
  show (message) {
    store.commit('app/updateErrorMessage', message)
  }
}
