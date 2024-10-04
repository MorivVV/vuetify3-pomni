<template>
  <div>
    <v-row>
      <v-col cols="6">
        <TextFielsV v-model="search" label="Поиск" />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="icon in micons.filter((e) => e.includes(search))"
        :key="'micon' + icon"
        cols="auto"
      >
        <v-card>
          <v-card-title>
            <v-icon>{{ icon }}</v-icon>
          </v-card-title>
          <v-card-text>
            {{ icon }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from "@/store/modules/admin";
import { ref } from "vue";
import TextFielsV from "@/components/basic/TextFielsV.vue";

const search = ref("");
const { micons } = useAdminStore();
</script>
