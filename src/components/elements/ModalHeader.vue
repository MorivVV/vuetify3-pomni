<template>
  <v-row align="center" class="darken-4" :class="modalClass">
    <v-col class="text-h5 white--text pa-0 text-center">
      {{ title }}
    </v-col>
    <BtnCubicVue
      v-if="formDelete"
      :action="formDelete"
      class="btn-small red accent-4 right"
      :disabled="disable"
      icon="delete"
      title="Удалить"
    />
    <BtnCubicVue
      :action="formOk"
      class="btn-small green right"
      :disabled="disable"
      title="Добавить"
    />
    <BtnCubicVue
      :action="formCancel"
      class="btn-small red right"
      :disabled="disable"
      icon="close"
      title="Отменить"
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
  data () {
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
