<template>
  <span>
    <v-tooltip
      location="bottom"
      :open-on-click="activeTooltip"
      :open-on-focus="activeTooltip"
      :open-on-hover="activeTooltip"
    >
      <template #activator="{ props }">
        <v-btn
          :class="`bg-${colorbtn}`"
          :dark="dark"
          density="comfortable"
          :disabled="disabled"
          elevation="3"
          icon
          :loading="loading"
          :rounded="cubic ? '0' : '1'"
          :size="xSmall ? 'small' : 'medium'"
          :to="url"
          v-bind="props"
          @click.prevent="action"
        >
          <v-icon :color="color" :icon="mdiIcon" size="medium" />
        </v-btn>
      </template>
      <span>{{ title }}</span>
    </v-tooltip>
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  action: { type: Function, default: () => false },
  dark: { type: Boolean, default: true },
  xSmall: { type: Boolean, default: true },
  cubic: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  title: { type: String, default: "Ок" },
  url: { type: String, default: null },
  icon: { type: String, default: "check" },
  color: { type: String, default: "primary" },
  colorbtn: { type: String, default: "white" },
  disabled: { type: Boolean, default: false },
});
const mdiIcon = computed(() => {
  const icon = props.icon;
  if (icon.indexOf("mdi-") === 0) return icon;
  return "mdi-" + icon;
});
const activeTooltip = props.title !== "";
</script>
