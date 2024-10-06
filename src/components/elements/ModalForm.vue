<template>
  <div class="addmodal">
    <div class="container">
      <div class="lighten-5 add-form" :class="modalClass">
        <ModalHeaderVue
          :form-cancel="formCancel"
          :form-delete="formDelete"
          :form-ok="formOk"
          :modal-class="modalClass"
          :title="title"
        />

        <slot />

        <ModalHeaderVue
          :form-cancel="formCancel"
          :form-ok="formOk"
          :modal-class="modalClass"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ModalHeaderVue from "./ModalHeader.vue";

export default defineComponent({
  components: {
    ModalHeaderVue,
  },
  props: {
    modalClass: { type: String, default: "blue" },
    title: { type: String, default: "" },
    formCancel: Function,
    formDelete: Function,
    formOk: Function,
  },
});
</script>

<style scoped>
.addmodal {
  display: flex;
  overflow-y: scroll;
  height: 100%;
}
.container {
  margin: auto;
}
.row {
  margin-left: -1px;
  margin-right: -2px;
  margin-bottom: 0px;
  padding: 2px;
}
</style>
