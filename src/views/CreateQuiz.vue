<template>
  <div class="create-quiz">
    <div class="container page">
      <h4 class="page__heading">Create a Quiz</h4>
      <div class="page__body">
        <div class="create-steps">
          <span class="complete">1</span>
          <span :class="step == 2 ? 'complete' : ''">2</span>
        </div>

        <form class="quiz-form" method="post" action="" @submit.prevent="createQuiz">
          <div v-if="errorMessage" class="form-group">
            <p class="quiz-form__error">{{ errorMessage }}</p>
          </div>

          <div v-if="step == 1">
            <div class="form-group">
              <label for="title">Quiz Title</label>
              <input v-model="title" type="text" name="title" id="title" placeholder="eg. The Solar System" required />
            </div>
            <div class="form-group">
              <label for="description">Quiz Description</label>
              <textarea v-model="description" name="description" id="description" placeholder="Describe the quiz" required></textarea>
            </div>
            <div class="form-group">
              <label for="backdrop">Quiz Backdrop</label>
              <input v-model="backdrop" type="text" name="backdrop" id="backdrop" placeholder="Enter image url">
            </div>
            <div class="form-group">
              <label></label>
              <img v-if="backdrop" :src="backdrop" alt="Backdrop" width="100%" height="auto" />
            </div>
          </div>

          <div v-else>
            <div v-for="question in questions" :key="question._id" class="form-group">
              <label>Question {{ question._id }}</label>
              <div class="question">
                <label>Question text</label>
                <textarea class="question__text" v-model="question.text" placeholder="Enter the question" required></textarea>
                <label>Options</label>
                <div class="question__options">
                  <p 
                  v-for="option in question.options" 
                  :key="option" 
                  :class="{ 'question__option': true, 'question__option--correct': option == question.answer }"
                  @click="setQuestionAnswer(question, option)">
                    {{ option }} <span @click.stop="removeOption(question.options, option)" class="lnr lnr-trash"></span>
                  </p>
                </div>
                <input @keydown.enter.prevent="addOption($event, question.options)" type="text" name="newOption" placeholder="Add a new option" class="new-option" />
              </div>
            </div>

            <div class="form-group">
              <button @click="addQuestion" type="button" class="add-question-btn"><span class="lnr lnr-question-circle"></span> <span>ADD QUESTION</span></button>
            </div>
          </div>

          <div class="quiz-form__buttons">
            <button v-if="step == 2" @click="prev" class="quiz-form__prev" type="button">PREV</button>
            <button v-if="step == 1" @click="next" class="quiz-form__next" type="button">NEXT</button>
            <button v-if="step == 2" class="quiz-form__submit" type="submit" :disabled="$store.getters.quizCreationStatus == 'loading'">CREATE</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'create-quiz',
  data() {
    return {
      errorMessage: null,
      step: 1,
      formComplete: false,
      title: '',
      description: '',
      backdrop: '',
      questions: [{
        _id: 1,
        text: '',
        options: [],
        answer: ''
      }]
    };
  },
  methods: {
    prev() {
      if (this.step > 1)
        this.step--;
    },
    next() {
      if (this.step < 2) {
        this.step++;
        this.formComplete = true;
      }
    },
    setQuestionAnswer(question, option) {
      question.answer = option;
    },
    removeOption(options, option) {
      options.splice(options.indexOf(option), 1);
    },
    addOption({ target }, options) {
      if (target.value && !options.find(o => o == target.value)) {
        options.push(target.value);
        target.value = '';
      }
    },
    addQuestion() {
      this.questions.push({
        _id: this.questions.length + 1,
        text: '',
        options: [],
        answer: ''
      });
    },

    createQuiz() {
      const compo = this;
      const { title, description, backdrop, questions } = this;
      const requestBody = { title, description, backdrop, questions };

      requestBody.axios = this.$http;

      this.$store.dispatch('createQuiz', requestBody)
        .then(viewQuiz)
        .catch(handleCreateError);

      function viewQuiz({ data }) {
        compo.$router.push({ name: 'view-quiz', params: { quizId: data.data.refId } });
      }

      function handleCreateError({ response: { status, data } }) {
        if (status == 500)
          compo.errorMessage = 'An error occured while creating';
        else
          compo.errorMessage = data.message;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';

.page__heading {
  text-align: center;
}

.create-steps {
  width: 40%;
  min-width: 120px;
  margin: $spacing-1 auto $spacing-6 auto;
  display: flex;
  justify-content: space-between;
  position: relative;

  span {
    display: block;
    width: 30px;
    line-height: 30px;
    color: $white;
    text-align: center;
    border-radius: 50%;
    background: rgb(180, 180, 180);

    &.complete {
      background: $primary;
    }
  }

  span:last-child:before {
    display: block;
    content: "";
    background: rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 2px;
    position: absolute;
    right: 0;
    margin-top: 15px;
    z-index: -1;
  }

  span:last-child.complete:before {
    background: $primary;
  }
}

.quiz-form {
  display: block;
  width: 100%;
  max-width: 550px;
  margin: 0 auto;

  .form-group {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: flex-start;

    label {
      flex-basis: 25%;
      @media (max-width: 767px) {
        flex-basis: 100%;
      }
    }

    > input,
    > textarea {
      flex-basis: 70%;
      border: 1px solid #ccc;
      border-radius: 4px;
      @media (max-width: 767px) {
        flex-basis: 100%;
      }
    }
  }
}

.quiz-form__buttons {
  display: flex;
  justify-content: space-between;
  margin-top: $spacing-5;

  button {
    padding: $spacing-2 $spacing-3;
    background: transparent;
    border: 1px solid $primary-light-1;
    color: $primary-dark-2;
    border-radius: 4px;

    &:hover {
      background: rgba($primary-light-2, 0.55);
    }
  }
}

.quiz-form__error {
  color: hsl(0, 100%, 45%);
}

.quiz-form__next,
.quiz-form__submit {
  margin-left: auto;
}

.question {
  flex-basis: 70%;

  label {
    font-weight: bold;
  }
}

.question__text {
  width: 100%;
  margin-bottom: $spacing-2;
  border-radius: 4px;
}

.question__options {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.question__option {
  display: flex;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  border-radius: 4px;
  padding: $spacing-1 $spacing-2;
  margin-right: $spacing-2;
  margin-bottom: $spacing-1;

  &.question__option--correct {
    background: hsla(160, 100%, 56%, 0.4);
    border: 1px solid hsl(160, 100%, 45%);
    color: hsl(160, 100%, 19%);
    font-weight: bold;
  }

  span {
    margin-left: $spacing-2;
    color: $primary-dark-1;
    font-weight: bold;

    &:hover {
      cursor: pointer;
    }
  }
}

.new-option {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: $spacing-2;
  width: 100%;
}

.add-question-btn {
  background: transparent;
  color: $grey-dark;
  margin-top: $spacing-5;

  span:nth-child(2) {
    text-decoration: underline;
  }
}
</style>