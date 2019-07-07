<template>
  <div class="quiz">
    <div class="container">
      <quiz-card v-if="quiz" @start="createSession" :showStart="true" :quiz="quiz" />
    </div>
  </div>
</template>

<script>
import QuizCard from '../components/QuizCard.vue';

export default {
  name: 'quiz',
  props: ['quizId'],
  components: { QuizCard },

  data() {
    return {
      quiz: null
    }
  },

  mounted() {
    this.$store.dispatch('getQuiz', { axios: this.$http, quizId: this.quizId })
      .then(({ data }) => this.quiz = data.data)
      .catch(console.error);
  },

  methods: {
    createSession() {
      const compo = this;

      if (this.quiz.session)
        return;
      else
        this.$store.dispatch('createSession', { axios: this.$http, quizId: this.quiz.refId })
          .then(captureSessionId)
          .then(gotoSession)
          .catch(console.error);

      function captureSessionId({ data }) {
        return data.data.sessionId;
      }

      function gotoSession(sessionId) {
        compo.$router.push({ name: 'session', params: { sessionId } });
      }
    }
  },
};
</script>

<style lang="scss">
@import '@/assets/styles/global.scss';

.quiz {
  padding: $spacing-2 0 $spacing-2 0;
}
</style>