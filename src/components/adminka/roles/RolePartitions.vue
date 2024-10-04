<template>
  <v-card>
    <v-row align="center" class="ma-1">
      <v-col cols="4" class="text-h4 text-right"> Разделы </v-col>
      <v-col cols="4">
        <AutocompleteVVue
          v-model="newPartition.kod_access"
          auto-select-first
          prepend-icon="add_location"
          multiple
          clearable
          label="Выбрать раздел"
          :items="lastPartition"
          item-value="id"
          item-text="namien"
        />
      </v-col>
      <v-col cols="2">
        <AutocompleteVVue
          v-model="newPartition.access_level"
          outlined
          label="Уровень доступа"
          :items="levels"
          item-value="id"
          item-text="name"
          dense
          hide-details
        />
      </v-col>
      <v-col cols="auto">
        <v-btn fab x-small color="blue" dark @click="addPartition">
          <v-icon>add</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-list
      v-for="partition in partitionList"
      :key="roleId + '_partition_' + partition.id"
      color="amber lighten-5"
      class="pa-0"
      dense
    >
      <v-divider />
      <PartitionVue :partition="partition" @delPartition="changeRolesAccess" />
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useAdminStore } from "@/store/modules/admin";
import { mapState } from "pinia";
import PartitionVue from "./Partition.vue";
import AutocompleteVVue from "@/components/basic/AutocompleteV.vue";

export default defineComponent({
  components: {
    PartitionVue,
    AutocompleteVVue,
  },
  props: {
    roleId: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const { r_insert, checkDataModify } = dataApiComposition();
    return { r_insert, checkDataModify };
  },
  data() {
    return {
      newPartition: {
        kod_access: null as null | number[],
        kod_role: this.roleId,
        access_level: 1,
      },
    };
  },
  computed: {
    ...mapState(useAdminStore, [
      "partitions",
      "roles",
      "roles_access",
      "roles_users",
      "levels",
    ]),
    partitionList(): IRoleAccess[] {
      let list: IRoleAccess[] = [];
      list = this.roles_access.filter(
        (u: { kod_role: number }) => u.kod_role === this.roleId
      );
      return list;
    },
    lastPartition(): IPartitionAccess[] {
      return this.partitions.filter(
        (e) => this.partitionList.map((p) => p.kod_access).indexOf(e.id) === -1
      );
    },
  },
  methods: {
    changeRolesAccess() {
      this.$emit("RolesAccess");
    },
    addPartition() {
      if (this.newPartition.kod_access === null) {
        this.$toast({ html: "Необходимо указать раздел" });
        return;
      }
      const part = this.partitions;
      const acc = this.newPartition.kod_access.map((kod_access: any) => {
        return this.r_insert({
          to: "roles_access",
          fields: { ...this.newPartition, kod_access },
        }).then((r) =>
          this.checkDataModify(
            r,
            "Добавлен " +
              part.find((e: { id: any }) => e.id === kod_access)?.namien
          )
        );
      });
      Promise.all(acc)
        .then(() => this.changeRolesAccess())
        .then(() => {
          this.newPartition.kod_access = null;
        });
    },
  },
});
</script>
