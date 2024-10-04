<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      style="min-height: 32px"
      class="ma-0 pa-0 pl-2"
      @click="open = true"
    >
      <v-row class="ma-0 pa-0">
        <v-col class="ma-0 pa-1" cols="4">
          <v-icon color="blue"> account_circle </v-icon>{{ user.family }}
          {{ user.first_name }} {{ user.second_name }}
        </v-col>
        <v-col class="ma-0 pa-1" cols="1">
          {{ user.tabnum }}
        </v-col>
        <v-col class="ma-0 pa-1" cols="3" v-html="user.login" />
        <v-col class="ma-0 pa-1" cols="1"> id:{{ user.id }} </v-col>
        <v-col class="ma-0 pa-1 center" cols="3" offset-md="1" @click.stop>
          <SwitchV
            v-model="user.active"
            :label="user.active ? 'Активный' : 'Заблокирован'"
            @change="accessUser(user.id, user.active)"
          />
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <template v-if="open">
        <v-row class="ma-1">
          <v-col cols="12">
            <AutocompleteV
              label="Доступные разделы"
              :value="partAllow"
              :items="partitions"
              item-value="id"
              item-text="namien"
              multiple
              @input="changeAccess"
            >
              <template #selection="{ attrs, item, selected }">
                <v-chip
                  class="mt-1 ml-1"
                  v-bind="attrs"
                  close
                  small
                  :color="
                    levels.find(
                      (e) =>
                        e.id ===
                        access.find(
                          (a) =>
                            a.kod_user === +props.user.id &&
                            a.kod_access === +item.id
                        )?.access_level
                    )?.color
                  "
                  :input-value="selected"
                  @click:close="remove(item)"
                  @click.stop="changehLevel(item)"
                >
                  <v-icon color="red"> place </v-icon>
                  <span>{{ item.namien }}</span
                  >&nbsp;
                  <span>({{ item.path }})</span>
                </v-chip>
              </template>
            </AutocompleteV>
          </v-col>
          <v-col offset-md="11">
            <BtnIconsVVue
              :disabled="!editLevel()"
              color="white"
              colorbtn="green darken-3"
              :action="allAllow"
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
import { useAdminStore } from "@/store/modules/admin";
import { PropType, computed, ref, toRefs } from "vue";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { IKnowledgebaseBzUsers } from "@/types/database/schemas/knowledgebase";
import { addAccess, delAccess, getAccess } from "./accessMetods";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import AutocompleteV from "@/components/basic/AutocompleteV.vue";
import SwitchV from "@/components/basic/SwitchV.vue";
const emit = defineEmits(["changeLevel"]);
const props = defineProps({
  user: { type: Object as PropType<IKnowledgebaseBzUsers>, required: true },
});
const { editLevel } = routeAccessLevelCalculate();
const open = ref(false);

const { r_ajax, r_update } = dataApiComposition();
const { access, partitions, levels } = toRefs(useAdminStore());
const partAllow = computed(() => {
  let part: string[] = [];
  if (access.value.length) {
    part = access.value
      .filter((e) => e.kod_user === +props.user.id)
      .map((p) => String(p.kod_access));
  }
  return part;
});
const remove = (item) => {
  const index = partAllow.value.indexOf(item.id);
  if (index >= 0) {
    delAccess(props.user.id, item.id);
  }
};
const changeAccess = (e) => {
  const ua = partAllow.value;
  if (ua.length > e.length) {
    const res = ua.filter((a) => e.indexOf(a) < 0);
    if (res.length) {
      delAccess(props.user.id, res[0]);
    }
  } else {
    const res = e.filter((a) => ua.indexOf(a) < 0);
    if (res.length) {
      addAccess(props.user.id, res[0]);
    }
  }
};
const accessUser = (u: number, a: boolean) => {
  let msg = "Заблокирован";
  if (a) {
    msg = "Активирован";
  }
  r_update<keyof IKnowledgebaseBzUsers>({
    to: "bz_users",
    set: { active: a },
    filter: { id: u },
  }).then((r) => {
    if (r.count) {
      toast.info(msg);
    }
  });
};
const allAllow = () => {
  r_ajax({
    sqlname: "addAllAllow",
    kod_user: props.user.id,
  }).then((r) => {
    if (r.count) {
      toast.info({ html: "Доступ ко всем разделам предоставлен" });
      getAccess();
    }
  });
};
const changehLevel = (e) => {
  const currlevel = access.value.find(
    (a) => a.kod_user === +props.user.id && a.kod_access === +e.id
  )?.access_level;
  emit("changeLevel", currlevel, e.id, props.user.id);
};
</script>

<style scoped>
.user {
  padding: 5px;
  border-radius: 20px;
}
</style>
