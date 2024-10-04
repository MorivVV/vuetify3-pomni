<template>
  <v-row class="darken-4" :class="modalClass" align="center">
    <v-col class="text-h5 white--text pa-0 text-center">
      {{ title }}
    </v-col>
    <BtnCubicVue
      v-if="formDelete"
      icon="delete"
      :action="formDelete"
      :disabled="disable"
      title="Удалить"
      class="btn-small red accent-4 right"
    />
    <BtnCubicVue
      :action="formOk"
      :disabled="disable"
      title="Добавить"
      class="btn-small green right"
    />
    <BtnCubicVue
      icon="close"
      :disabled="disable"
      title="Отменить"
      :action="formCancel"
      class="btn-small red right"
    />
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BtnCubicVue from "../basic/BtnCubic.vue";

export default defineComponent({
  components: {
    BtnCubicVue,
  },
  props: {
    title: { type: String, default: "" },
    modalClass: { type: String, default: "blue" },
    formCancel: Function,
    formDelete: Function,
    formOk: Function,
  },
  data() {
    return {
      disable: false,
    };
  },
});
</script>

<style scoped>
.row {
  border-radius: 2px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 0px;
  padding: 2px;
}
</style>
