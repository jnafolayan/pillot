<template>
  <div class="session">
    <transition name="question">
      <div class="container">
        <div v-if="question" class="session-wrapper">
          <div class="progress">
            <div 
              v-for="bar in bars" 
              :key="bar.id" 
              :class="['progress__bar', { 'progress__bar--filled': bar.filled }]">
            </div>
          </div>
          <h1 class="question">{{ question.text }}</h1>

          <div class="options">
            <div 
              v-for="option in question.options" 
              :key="option.id" 
              :class="['option', { 'option--selected': option.selected }]" 
              @click="selectOption(option.id)">
              <p class="option__text"><span>{{ String.fromCharCode(option.id + 65) }}</span> {{ option.text }}</p>
            </div>
          </div>

          <button v-if="selectedId != -1 && !submitting" @click="submitAnswer" class="submit">SUBMIT</button>
        </div>
        <div v-else-if="ended" class="session-end">
          <h1 class="">Quiz session has ended</h1>
          <p>You got {{ stats.correctAnswers }} out of {{ stats.questionCount }} correct! You can take another quiz <router-link to="/explore">here</router-link>.</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'session',

  data() {
    return {
      question: null,
      quizId: null,
      selectedId: -1,
      bars: [],
      submitting: false,
      ended: false,
      stats: null
    };
  },

  mounted() {
    this.fetchSessionData();
  },

  methods: {
    fetchSessionData() {
      const compo = this;
      
      this.submitting = false;
      this.selectedId = -1;

      this.$store.dispatch('getSession', { 
        axios: this.$http, 
        sessionId: this.$route.params.sessionId 
      })
      .then(captureSessionData)
      .catch(console.error);

      function captureSessionData({ data }) {
        if (data.data.ended) {
          compo.ended = true;
          compo.stats = { ...data.data };
          return;
        }

        const { cursor, status, quizId, questionCount, question } = data.data;

        // give options unique ids
        question.options = shuffle(question.options).map((opt, i) => ({
          text: opt,
          id: i,
          selected: false
        }));
        
        compo.quizId = quizId;
        compo.question = question;
        compo.bars = Array(questionCount)
          .fill(false)
          .map((e, i) => ({ id: i, filled: i <= cursor }));

        function shuffle(array) {
          for (let i = 0, len = array.length; i < len; i++) {
            const j = Math.floor(Math.random() * len);
            const tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
          }
          return array;
        }
      }
    },

    selectOption(id) {
      if (this.selectedId != -1)
        this.question.options[this.selectedId].selected = false;

      const option = this.question.options[id];
      option.selected = true;
      this.selectedId = id;
    },

    submitAnswer() {
      this.submitting = true;

      const answer = this.question.options[this.selectedId].text;
      const { quizId } = this;

      this.$store.dispatch('submitAnswer', { 
        answer, 
        quizId, 
        questionId: this.question.refId, 
        sessionId: this.$route.params.sessionId,
        axios: this.$http 
      })
        .then(() => {
          this.question = null;
          setTimeout(() => this.fetchSessionData(), 1500);
        });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';

.session-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.progress {
  margin: $spacing-2 0;
  display: flex;
  justify-content: space-between;
}

.progress__bar {
  background: $grey-light;
  flex: 1;
  border-radius: 4px;
  margin: 0 $spacing-1;

  &.progress__bar--filled {
    background: $primary-light-2;
    height: 3px;
  }
}

.question {
  text-align: center;
  font-family: $ff-heading;
  font-size: $fs-title;
  margin: $spacing-5 0;
}

.options {
  padding-top: $spacing-5;
  display: flex;
  flex-direction: column;
}

.option {
  width: 100%;
  margin: 0 auto;
  padding: $spacing-3 $spacing-2;
  background: $white;
  border-radius: 4px;
  border: 1px solid $primary-light-1;
  margin-bottom: $spacing-2;
  color: $grey-dark;
  transition: all 0.2s;

  span {
    margin-right: $spacing-2;
    padding: 5px $spacing-1;
    border: 2px solid $primary-dark-2;
    color: $grey-darker;
    border-radius: 4px;
    font-weight: bold;
    transition: all 0.2s;
  }

  &:hover,
  &.option--selected {
    background: rgba($primary-light-2, 0.55);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(140, 140, 140, 0.3);

    span {
      background: $primary-dark-2;
      color: $white;
    }
  }
}

.submit {
  display: block;
  margin-top: $spacing-2;
  border: 2px solid $primary-light-1;
  color: $primary-dark-2;
  border-radius: 4px;
  padding: $spacing-2 $spacing-3;
  background: transparent;
  font-weight: bold;

  &:hover {
    background: rgba($primary-light-2, 0.55);
    box-shadow: 0 2px 4px rgba(140, 140, 140, 0.3);
  }
}

.session-end {
  text-align: center;

  h1 {
    font-family: $ff-heading;
    font-size: $fs-title;
    margin: $spacing-5 0;
  }

  a {
    color: $primary;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>