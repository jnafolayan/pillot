<template>
  <div 
    @click="close"
    @keydown.esc="close"
    class="modal-backdrop"
    role="dialog"
    aria-labelledby="modalTitle"
    aria-describedby="modalDescription">
    <div class="modal" @click.stop>
      <header class="modal__header">
        <slot name="heading"></slot>
      </header>
      <div class="modal__body">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'section',
  methods: {
    close(event) {
      this.$emit('close');
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global.scss';

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

.modal {
  background: $white;
  box-shadow: 0 8px 20px 5px rgba(0, 0, 0, 0.35);
  border-radius: 4px;
  overflow-x: auto;
  display: flex;
  width: 98%;
  max-width: 767px;
  margin-top: -20%;
  flex-direction: column;
}

.modal__header {
  padding: $spacing-2 $spacing-2;
  font-size: $fs-title;
  font-family: $ff-heading;
  color: $grey-dark;
}

.modal__body {
  padding: $spacing-3 $spacing-2;
}
</style>