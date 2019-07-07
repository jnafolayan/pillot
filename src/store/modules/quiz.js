const state = {
  quizCreationStatus: ''
};

const mutations = {
  QUIZ_CREATION_REQUEST(state) {
    state.quizCreationStatus = 'loading';
  },

  QUIZ_CREATION_SUCCESS(state, quizCreation) {
    state.quizCreationStatus = 'success';
  },

  QUIZ_CREATION_ERROR(state) {
    state.quizCreationStatus = 'error';
  }
};

const actions = {
  createQuiz({ commit }, payload) {
    const axios = payload.axios;
    delete payload.axios;

    commit('QUIZ_CREATION_REQUEST');

    return new Promise((resolve, reject) => {
      axios.post('/quizzes', payload)
        .then(resp => {
          commit('QUIZ_CREATION_SUCCESS');
          resolve(resp);
        })
        .catch(err => {
          commit('QUIZ_CREATION_ERROR');
          reject(err);
        });
    });
  },

  getQuizzes({ commit }, { axios, search }) {
    return new Promise((resolve, reject) => {
      const url = search ? `/quizzes?search=${search}` : '/quizzes';
      axios.get(url)
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  getQuiz({ commit }, { axios, quizId }) {
    return new Promise((resolve, reject) => {
      axios.get(`/quizzes/${quizId}`)
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  createSession({ commit }, { axios, quizId }) {
    return new Promise((resolve, reject) => {
      axios.post('/sessions', { quizId })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  getSession({ commit }, { axios, sessionId }) {
    return new Promise((resolve, reject) => {
      axios.get(`/sessions/${sessionId}`)
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  submitAnswer({ commit }, dto) {
    const axios = dto.axios;
    delete dto.axios;

    return new Promise((resolve, reject) => {
      axios.post(`/sessions/${dto.sessionId}/answer`, dto)
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

const getters = {

};

export default { state, mutations, actions, getters };