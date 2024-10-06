<template>
  <div>
    <v-row class="ma-1 pa-0">
      <v-col cols="5" class="ma-0 pa-1">
        <TextFielsV readonly :value="currentPrice" label="Цена" />
      </v-col>
      <v-col class="ma-0 pa-1">
        <TextFielsV v-model="count" label="Количество" type="number" />
      </v-col>
      <v-col class="ma-0 pa-1">
        <TextFielsV :value="sum" label="Сумма" />
      </v-col>
      {{ currentBillings?.value }}<br />
      {{ lastBillings?.value }}
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, onMounted, ref, toRefs, watch } from "vue";
import TextFielsV from "../basic/TextFielsV.vue";
import { IBillingMeters } from "@/types/database/schemas/billing";
import { useBillingsStore } from "@/store/modules/billings";
const emit = defineEmits(["calc"]);
const props = defineProps({
  meter: { type: Object as PropType<IBillingMeters>, required: true },
});
const count = ref(1);
const sum = computed(() => count.value * currentPrice.value);
const { prices, billings } = toRefs(useBillingsStore());
const currentPrice = computed(() => {
  let price = 0;
  const needPrice = prices.value.find(
    (e) => e.kod_resource === props.meter.kod_resource
  );
  if (needPrice && needPrice.billing) price = needPrice.billing / 100;
  return price;
});
const currentBillings = computed(() => {
  const bill = billings.value.find((e) => e.kod_meter === props.meter.id);
  return bill ? bill : { value: 0 };
});
const lastBillings = computed(() => {
  const bill = billings.value.find(
    (e) => e.kod_meter === props.meter.id && e.id !== currentBillings.value?.id
  );
  return bill ? bill : currentBillings.value;
});
watch(sum, (newVal, oldVal) => emit("calc", newVal - oldVal));
watch([currentBillings, lastBillings], () => {
  count.value =
    Number(currentBillings.value?.value) - Number(lastBillings.value?.value);
});
onMounted(() => {
  count.value =
    Number(currentBillings.value?.value) - Number(lastBillings.value?.value);
  console.log(count.value, currentBillings.value, lastBillings.value);

  emit("calc", sum.value);
});
</script>
