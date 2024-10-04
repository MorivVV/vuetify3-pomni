<template>
  <v-list-item class="pa-0 ma-0">
    <v-list-item-content class="ma-0 pl-1 pa-0">
      <v-row align="center" class="ma-0" justify="center">
        <v-col cols="5" class="text-h5 pl-1 pa-0 ma-0">
          <UserFioVue :user_id="user.kod_user" type-name="full" />
        </v-col>
        <v-col cols="5" class="text-h6 pl-1 pa-0 ma-0">
          <UserFioVue :user_id="user.kod_user" type-name="login" />
        </v-col>
        <v-col cols="1" class="pl-1 pa-1 ma-0" :class="nameLevel?.color">
          {{ nameLevel?.name }} ({{ user.access_level }})
        </v-col>
        <v-col cols="1" class="text-right pl-1 pa-0 ma-0">
          <BtnIconsV
            icon="delete"
            colorbtn="red"
            color="white"
            :action="delUser"
            title="Удалить пользователя"
          />
        </v-col>
      </v-row>
    </v-list-item-content>
  </v-list-item>
</template>

<script setup lang="ts">
import UserFioVue from "@/components/elements/UserFio.vue";
import { computed, toRefs } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useAdminStore } from "@/store/modules/admin";
import { PropType } from "vue";
import BtnIconsV from "@/components/basic/BtnIconsV.vue";

const { r_delete, checkDataModify } = dataApiComposition();
const props = defineProps({
  user: {
    type: Object as PropType<IRoleUser>,
    required: true,
  },
});
const { levels } = toRefs(useAdminStore());
const nameLevel = computed(() => {
  return levels.value.find((e) => e.id === props.user.access_level);
});
const emit = defineEmits(["delUser"]);
const delUser = () => {
  r_delete({
    from: "roles_users",
    filter: {
      id: props.user.id,
    },
  })
    .then((r) => checkDataModify(r))
    .then(() => {
      emit("delUser");
    });
};
</script>
