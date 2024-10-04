<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      class="ma-0 pa-0 pl-2"
      :class="{ 'green accent-1': part.access_all }"
      style="min-height: 32px"
      @click="open = true"
    >
      <v-row class="ma-0 pa-0">
        <v-col class="ma-0 pa-0" cols="5">
          <v-icon color="orange"> star </v-icon> {{ part.namien }}
        </v-col>
        <v-col class="ma-0 pa-0" cols="3">
          <v-icon color="red"> place </v-icon>
          <a :href="part.path" target="_blank">{{ part.path }}</a>
        </v-col>
        <v-col class="ma-0 pa-0" cols="1">
          {{ moment(+part.date_add).format(momentFormatDate) }}
        </v-col>
        <v-col class="ma-0 pa-0 center" cols="3" @click.stop>
          <SwitchV
            v-model="part.access_all"
            class="pa-0 ma-0"
            hide-details
            :label="
              part.access_all
                ? 'Доступно при регистрации'
                : 'Доступ по предоставлению'
            "
            @change="accessAll(part.id, part.access_all)"
          />
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <template v-if="open">
        <v-row class="ma-1">
          <v-col cols="12">
            <AutocompleteV
              item-text="full"
              item-value="id"
              :items="usersFioArray"
              label="Пользователи с доступом"
              multiple
              :value="userAllow"
              @input="changeAccess"
            >
              <template #selection="{ attrs, item, selected }">
                <v-chip
                  class="mt-1 ml-1"
                  v-bind="attrs"
                  close
                  :color="
                    levels.find(
                      (e) =>
                        e.id ===
                        access.find(
                          (a) =>
                            a.kod_user === +item.id &&
                            a.kod_access === +props.part.id
                        )?.access_level
                    )?.color
                  "
                  :input-value="selected"
                  small
                  @click.stop="changehLevel(item)"
                  @click:close="remove(item)"
                >
                  <v-avatar left>
                    <v-icon color="red"> account_circle </v-icon>
                  </v-avatar>
                  <UserFio :user_id="item.id" />
                </v-chip>
              </template>
            </AutocompleteV>
          </v-col>
          <v-col offset-md="11">
            <BtnIconsVVue
              :action="addAllPartition"
              color="white"
              colorbtn="green darken-3"
              :disabled="!editLevel()"
              icon="filter_9_plus"
              title="Предоставить все доступы"
            />
          </v-col>
        </v-row>
      </template>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import { useUserDataStore } from "@/store/modules/usersData";
import { useAdminStore } from "@/store/modules/admin";
import { computed, defineProps, PropType, ref, toRefs } from "vue";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { IKnowledgebasePartitionAccess } from "@/types/database/schemas/knowledgebase";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import { addAccess, delAccess, getAccess } from "./accessMetods";
import AutocompleteV from "@/components/basic/AutocompleteV.vue";
import UserFio from "@/components/elements/UserFio.vue";
import { momentFormatDate } from "@/const/timeFormats";
import SwitchV from "@/components/basic/SwitchV.vue";
import moment from "moment";

const props = defineProps({
  part: {
    type: Object as PropType<IKnowledgebasePartitionAccess>,
    required: true,
  },
});
const emit = defineEmits(["changeLevel"]);
const { editLevel } = routeAccessLevelCalculate();
const { r_ajax, r_update } = dataApiComposition();
const open = ref(false);
const { access, levels } = toRefs(useAdminStore());
const { usersFioArray } = toRefs(useUserDataStore());
const userAllow = computed(() => {
  let user: number[] = [];
  if (access.value.length > 0) {
    user = access.value
      .filter((e) => e.kod_access === +props.part.id)
      .map((p) => p.kod_user);
  }
  return user;
});
const remove = (item) => {
  const index = userAllow.value.indexOf(item.id);
  if (index >= 0) {
    delAccess(item.id, props.part.id);
  }
};
const addAllPartition = () => {
  r_ajax({
    sqlname: "addAllPartition",
    kod_partition: props.part.id,
  }).then((r) => {
    if (r.count) {
      toast.info({
        html: "Доступ к разделу предоставлен всем пользователям",
      });
      getAccess();
    }
  });
};
const accessAll = (id: number, all: boolean) => {
  r_update<keyof IKnowledgebasePartitionAccess>({
    to: "partition_access",
    set: { access_all: all },
    filter: { id },
  }).then((r) => {
    if (r.count) {
      toast.info("Установленно");
    }
  });
};

const changeAccess = (e) => {
  const ua = userAllow.value;
  if (ua.length > e.length) {
    const res = ua.filter((a) => e.indexOf(a) < 0);
    if (res.length) {
      delAccess(res[0], props.part.id);
    }
  } else {
    const res = e.filter((a) => ua.indexOf(a) < 0);
    if (res.length) {
      addAccess(res[0], props.part.id);
    }
  }
};
const changehLevel = (e) => {
  const currlevel = access.value.find(
    (a) => a.kod_user === +e.id && a.kod_access === +props.part.id
  )?.access_level;
  emit("changeLevel", currlevel, props.part.id, e.id);
};
// watch(
//   userAllow,
//   (newVal, oldVal) => {
//     console.log(userAllow.value);

//     if (newVal.length > oldVal.length) {
//       const kodUser = newVal.find(
//         (e) => oldVal.filter((o) => e === o).length === 0
//       );
//       if (kodUser) addAccess(kodUser, props.part.id);
//     }
//   },
//   { deep: true }
// );
</script>
