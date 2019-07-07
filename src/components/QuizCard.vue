<template>
  <div class="quiz-card">
    <div class="quiz-card__body">
      <h2 class="quiz-card__title">{{ quiz.title }}</h2>
      <p><small><span class="lnr lnr-question-circle"></span> {{ quiz.questionCount }}</small></p>
      <p class="quiz-card__desc">{{ quiz.description }}</p>
      
      <!-- this div prevents the issue of the link expanding horizontally -->
      <div> 
        <router-link v-if="quiz.session" :to="quizLink" class="quiz-card__link">
          <button type="button" class="quiz-card__btn">CONTINUE QUIZ</button>
        </router-link>

        <router-link v-else :to="quizLink" class="quiz-card__link">
          <button @click="onStartClick" type="button" class="quiz-card__btn">{{ buttonText }}</button>
        </router-link>
      </div>
    </div>
    <div class="quiz-card__backdrop" :style="backgroundStyle"></div>
  </div>
</template>

<script>
export default {
  name: 'quiz-card',
  props: ['quiz', 'showStart'],
  methods: {
    onStartClick() {
      this.$emit('start');
    }
  },
  computed: {
    backgroundStyle() {
      return `background-image: url(${this.quiz.backdrop})`;
    },

    quizLink() {
      if (!this.showStart)
        return `/explore/${this.quiz.refId}`;
      else {
        if (this.quiz.session)
          return `/session/${this.quiz.session}`;
        else
          return '#';
      }
    },

    buttonText() {
      if (this.showStart) {
        if (this.quiz.session)
          return 'CONTINUE QUIZ';
        else 
          return 'START QUIZ';
      } else 
        return 'TAKE QUIZ';
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global.scss';

.quiz-card {
  flex-basis: 100%;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  position: relative;

  @media (min-width: 768px) {
    flex-direction: row;
  }
}

.quiz-card__backdrop {
  width: 100%;
  height: 150px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  @media (min-width: 768px) {
    width: 35%;
    height: 250px;
  }
}

.quiz-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: $spacing-2 $spacing-3;
}

.quiz-card__title {
  margin-bottom: $spacing-1;
  font-family: $ff-heading;
  font-size: $fs-heading;
  color: $primary;
}

.quiz-card__desc {
  margin-top: $spacing-3; 
  font-family: $ff-body;
  font-size: $fs-medium;
  color: $grey;
  flex: 1;
}

.quiz-card__btn {
  color: $primary-dark-2;
  background: transparent;
  border: 1px solid $primary-light-2;
  border-radius: 4px;
  padding: $spacing-2 $spacing-3;
  background: transparent;
  margin-top: $spacing-1;

  &:hover {
    background: rgba($primary-light-2, 0.55);
    box-shadow: 0 2px 4px rgba(140, 140, 140, 0.3);
  }
}
</style>
