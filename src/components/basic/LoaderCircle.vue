<template>
  <v-progress-circular
    :class="'text-' + position"
    color="primary"
    indeterminate
  />
</template>

<script setup lang="ts">
defineProps({
  position: { type: String, default: "right" },
});
</script>
