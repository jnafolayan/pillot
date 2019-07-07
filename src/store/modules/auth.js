const state = {
  status: '',
  token: localStorage.getItem('token') || ''
};

const mutations = {
  AUTH_REQUEST(state) {
    state.status = 'loading';
  },

  AUTH_SUCCESS(state, token = null) {
    state.status = 'success';
    state.token = token;
  },

  AUTH_ERROR(state) {
    state.status = 'error';
  },
  
  LOGOUT(state) {
    state.status = '';
    state.token = '';
  }
};

const actions = {
  signin({ commit }, payload) {
    const axios = payload.axios;
    delete payload.axios;

    commit('AUTH_REQUEST');

    return new Promise((resolve, reject) => {
      axios.post('/users/login', payload)
        .then(resp => {
          const { token } = resp.data.data;
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          localStorage.setItem('token', token);
          commit('AUTH_SUCCESS', token);
          resolve(resp);
        })
        .catch(err => {
          commit('AUTH_ERROR');
          localStorage.removeItem('token');
          reject(err);
        });
    });
  },

  signup({ commit }, payload) {
    const axios = payload.axios;
    delete payload.axios;

    return new Promise((resolve, reject) => {
      commit('AUTH_REQUEST');
      axios.post('/users', payload)
        .then(resp => {
          commit('AUTH_SUCCESS');
          resolve(resp);
        })
        .catch(err => {
          commit('AUTH_ERROR');
          localStorage.removeItem('token');
          reject(err);
        });
    });
  },

  signout({ commit }, payload) {
    const axios = payload.axios;
    delete payload.axios;

    return new Promise((resolve, reject) => {
      commit('LOGOUT');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      resolve();
    });
  }
};

const getters = {
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status
};

export default { state, mutations, actions, getters };