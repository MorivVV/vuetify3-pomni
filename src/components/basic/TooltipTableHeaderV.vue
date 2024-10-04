<template>
  <span>
    <span v-html="text" />
    <v-tooltip activator="parent" location="top">
      <span v-html="tip" />
    </v-tooltip>
  </span>
</template>

<script setup lang="ts">

defineProps({
    text: { type: String, default: "-", require: true },
    tip: { type: String, default: "-", require: true },
  });
</script>
