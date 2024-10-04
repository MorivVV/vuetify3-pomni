<template>
  <div>
    <v-row v-for="(name, key) in mailType" :key="'mail_' + key" class="ma-1">
      <v-col class="pa-0 ma-0">
        <v-textarea
          v-model.lazy="mailObjectJSON[key]"
          :label="name + '(' + key + ')'"
          rows="1"
          row-height="20"
          outlined
          dense
          hide-details
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { PropType } from "vue/types/v3-component-props";

interface IMailObject {
  to?: string;
  cc?: string;
  bc?: string;
}
const mailType: Required<IMailObject> = {
  to: "Кому",
  cc: "Копия",
  bc: "Скрытая копия",
};
const props = defineProps({
  mailString: {
    type: null as any as PropType<string | null>,
    required: true,
  },
});
const emit = defineEmits(["input"]);
const mailObjectJSON = ref<IMailObject>(JSON.parse(props.mailString ?? "{}"));
const checkMailString = (mailString: string | undefined) => {
  if (!mailString) {
    mailString = undefined;
  } else {
    mailString = mailString
      .match(/[\w\.-]+@(sberbank|mail|omega|sber)(\.ca)?(\.sbrf)?\.ru/g)
      ?.join(", ");
  }
  return mailString;
};
const timer = ref(0);
watch(
  mailObjectJSON,
  (val) => {
    if (timer.value) clearInterval(timer.value);
    timer.value = setInterval(() => {
      val["to"] = checkMailString(val["to"]);
      val["cc"] = checkMailString(val["cc"]);
      val["bc"] = checkMailString(val["bc"]);
      emit("input", JSON.stringify(val));
    }, 300);
  },
  { deep: true }
);
</script>
