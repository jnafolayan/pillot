<template>
  <div class="explore">
    <div class="container">
      <div class="explore__search">
        <form method="post" action="" @submit.prevent="exploreQuery">
          <div class="input-group">
            <input v-model="search" type="search" name="search" placeholder="Search">
            <button type="submit">
              <span class="lnr lnr-magnifier"></span>
            </button>
          </div>
        </form>
      </div>
      <div v-if="quizzes.length" class="quizzes">
        <quiz-card v-for="quiz in quizzes" :key="quiz.refId" :quiz="quiz" />
      </div>
      <div v-else class="no-quizzes">
        <p>There are no quizzes yet. Create one!</p>
      </div>
    </div>
  </div>
</template>

<script>
import QuizCard from '../components/QuizCard.vue';

export default {
  name: 'explore',
  components: { QuizCard },

  data() {
    return {
      search: '',
      quizzes: []
    }
  },

  mounted() {
    this.getQuizzes();
  },

  methods: {
    exploreQuery() {
      const { search } = this;
      this.$router.push({ name: 'explore', query: { search } });
    },

    getQuizzes() {
      this.$store.dispatch('getQuizzes', { axios: this.$http, search: this.$route.query.search })
        .then(({ data }) => this.quizzes = data.data)
        .catch(console.error);
    }
  },

  watch: {
    '$route.query.search'() {
      this.getQuizzes();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';

.explore__search {
  width: 100%;
  max-width: 500px;
  margin: $spacing-2 auto;

  @media (min-width: 768px) {
    display: none;
  }

  input {
    padding: $spacing-1;
    font-size: $fs-body;
    width: 100%;
    border: 1px solid rgb(200, 200, 200);
    border-right-width: 0;
  }

  button {
    background: rgba(200, 200, 200, 0.6);
    padding: $spacing-1 $spacing-2;
    border: 1px solid rgb(200, 200, 200);
    border-left-width: 0;
  }
}

.quizzes {
  display: flex;
  flex-direction: column;
  padding: $spacing-2 0 $spacing-2 0;

  > .quiz-card {
    margin-bottom: $spacing-2;
    box-shadow: 0 1px 1px rgba(110,110,110,0.25), 0 -1px 1px rgba(150,150,150,0.25);
    
    @media (min-width: 768px) {
      border-left: 1px solid $primary-light-2;
    }
  }
}

.no-quizzes {
  margin: $spacing-4 0;
  font-family: $ff-body;
  font-size: $fs-title;
  text-align: center;
}
</style>
