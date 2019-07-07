<template>
  <div>
    <nav class="navbar">
      <div class="container">
        <router-link to="/" class="navbar__brand">pillot</router-link>
        <div class="navbar__search">
          <form method="post" action="" @submit.prevent="exploreQuery">
            <div class="input-group">
              <input v-model="search" type="search" name="search" placeholder="Search">
              <button type="submit">
                <span class="lnr lnr-magnifier"></span>
              </button>
            </div>
          </form>
        </div>
        <div class="navbar__auth">
          <router-link v-if="!$store.getters.isLoggedIn" to="#" class="navbar__link">
            <span @click="auth.modal = true">Sign In</span>
          </router-link>
          <router-link v-else to="#" class="navbar__link">
            <span @click="signout">Sign Out</span>
          </router-link>
        </div>
      </div>
    </nav>
    <div class="navbar-nav">
      <div class="container">
        <ul class="nav">
          <li><router-link to="/explore" class="nav__link">EXPLORE</router-link></li>
          <li><router-link to="/create" class="nav__link">CREATE A QUIZ</router-link></li>
        </ul>
      </div>
    </div>
    
    <transition name="modal">
      <modal v-if="auth.modal" class="auth-modal" @close="auth.modal = false">
        <div slot="heading" class="auth-modal__tabs">
          <button :class="{ 'auth-modal__tab': true, 'auth-modal__tab--active': auth.action == 'signin' }" @click="auth.action = 'signin'">Sign In</button>
          <button :class="{ 'auth-modal__tab': true, 'auth-modal__tab--active': auth.action == 'signup' }" @click="auth.action = 'signup'">Sign Up</button>
        </div>
        <div slot="body" class="auth-modal__container">
          <form method="post" action="" @submit.prevent="doAuth">
            <div class="auth-modal__info">
              <p v-if="auth.action == 'signin'">Login to access your account</p>
              <p v-else>Create a new account</p>
            </div>
            <div v-if="auth.errorMessage" class="form-group">
              <p class="auth-error">{{ auth.errorMessage }}</p>
            </div>
            <div class="form-group">
              <div class="input-group">
                <span class="lnr lnr-user"></span>
                <input v-model="username" type="text" name="username" placeholder="Enter your username" />
              </div>
            </div>
            <div class="form-group">
              <div class="input-group">
                <span class="lnr lnr-lock"></span>
                <input v-model="password" type="password" name="password" minlength="5" placeholder="Enter your password" />
              </div>
            </div>
            <button type="submit" class="auth-modal__submit" :disabled="$store.getters.authStatus == 'loading'">CONTINUE</button>
          </form>
        </div>
      </modal>
    </transition>
  </div>
</template>

<script>
import Modal from '@/components/Modal.vue';

export default {
  name: 'navbar',
  components: { Modal },

  data() {
    return {
      search: null,
      username: null,
      password: null,
      auth: {
        modal: false,
        action: 'signin',
        errorMessage: null
      }
    };
  },

  methods: {
    exploreQuery() {
      const { search } = this;
      this.$router.push({ name: 'explore', query: { search } });
    },

    signout() {
      this.$store.dispatch('signout', { axios: this.$http })
        .then(() => this.$router.push('/'));
    },

    doAuth() {
      const compo = this;
      const { username, password, auth: { action } } = this;
      const requestBody = { username, password };

      // attach axios
      requestBody.axios = this.$http;

      if (action == 'signin') {
        this.$store.dispatch('signin', requestBody)
          .then(loginUser)
          .catch(handleError);
      } else if (action == 'signup') {
        this.$store.dispatch('signup', requestBody)
          .then(signupUser)
          .catch(handleError);
      }

      function handleError({ response: { data } }) {
        compo.auth.errorMessage = data.message;
      }

      function loginUser() {
        compo.auth.modal = false;
      }

      function signupUser() {
        compo.auth.action = 'signin';
      }
    }
  },

  watch: {
    '$route': {
      deep: true,
      handler($route) {
        if ($route.query.auth)
          this.auth.modal = true;
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global.scss';

.navbar {
  padding: $spacing-2 0;
  
  > .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.navbar__brand {
  color: $primary-dark-1;
  font-size: $fs-title;
  font-family: $ff-heading;
}

.navbar__search {
  margin: 0 auto;

  input {
    padding: $spacing-1;
    width: 30vw;
    font-size: $fs-body;
    max-width: 300px;
    border: 1px solid rgb(200, 200, 200);
    border-right-width: 0;
  }

  button {
    background: rgba(200, 200, 200, 0.6);
    padding: $spacing-1 $spacing-2;
    border: 1px solid rgb(200, 200, 200);
    border-left-width: 0;
  }

  @media (max-width: 767px) {
    display: none;
  }
}

.navbar__link {
  color: $grey;

  &.router-link-active {
    color: $primary-dark-1;
  }
}

.navbar-nav {
  position: relative;
}

.navbar-nav > .container {
  background: $primary;
  position: relative;
  
  &:before,
  &:after {
    // display: block;
    display: none;
    content: "";
    position: absolute;
    width: 10px;
    height: 70%;
    padding: 0;
    margin: 0;
    box-sizing: content-box;
    z-index: -1;
  }

  &:before {
    left: 0;
    transform: translate(-100%, 20%);
    background: linear-gradient(to right, $primary-dark-2, darken($primary-dark-2, 12%));
  }

  &:after {
    right: 0;
    top: 0;
    transform: translate(100%, 20%);
    background: linear-gradient(to left, $primary-dark-2, darken($primary-dark-2, 12%));
  }
}

.nav {
  overflow-x: auto;
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-around;
}

.nav li {
  display: inline-block;

  .nav__link {
    display: block;
    color: $white;
    padding: $spacing-3 $spacing-2;
  }
}

.auth-modal .modal__header {
  padding: 0;
}

.auth-modal__tabs {
  display: flex;
}

.auth-modal__tab {
  flex: 1 1;
  text-align: center;
  font-family: $ff-heading;
  font-size: $fs-title;
  padding: $spacing-2 $spacing-2;
  background: $primary;
  color: $white;

  &.auth-modal__tab--active {
    background: $white;
    color: $grey;
  }
}

.auth-modal {
  .modal__body {
    padding-top: $spacing-5;
    padding-bottom: $spacing-5;
  }

  form {
    width: 100%;
    max-width: 468px;
    margin: 0 auto;

    .input-group {
      align-items: stretch;
      align-content: stretch;

      span {
        line-height: 45px;
        background: rgba(200, 200, 200, 0.6);
        padding: 0 $spacing-2;
        border: 1px solid rgb(200, 200, 200);
        border-right: none;
        border-top-left-radius: 4px;
        border-top-right-radius: 0;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 0;
      }

      input {
        height: 50px;
        width: 100%;
        border: 1px solid $grey-light;
        padding-left: $spacing-3;
        border-top-left-radius: 0;
        border-top-right-radius: 4px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 4px;
      }
    }
  }
}

.modal-enter .modal,
.modal-leave-to .modal {
  transform: translateY(-100%);
}

.modal-enter-active .modal {
  transform: translateY(0);
  transition: all 0.2s;
}

.auth-error {
  color: hsl(0, 100%, 45%);
}

.auth-modal__info {
  text-align: center;
  font-size: $fs-body;
  color: $grey-dark;
  margin-bottom: $spacing-2;
}

.auth-modal__submit {
  width: 100%;
  text-align: center;
  font-size: $fs-body;
  font-family: $fs-heading;
  background: $primary-dark-2;
  border-radius: 4px;
  padding: $spacing-3 $spacing-2;
  box-shadow: 0 2px 4px rgba(40, 40, 40, 0.3);
  color: $white;
}
</style>