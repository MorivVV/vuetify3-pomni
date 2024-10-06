<template>
  <td :colspan="colspan" style="padding: 0">
    <v-row>
      <v-col>
        <v-text-field
          v-model="billing"
          label="расценки"
          outlined
          dense
          hide-details
        ></v-text-field>
      </v-col>
      <v-col>{{ date_beg }}</v-col>
      <v-col>
        <DatePickerVVue @input="setDate" />
      </v-col>
      <v-col>
        <BtnIconsVVue
          title="Добавить"
          color="green"
          icon="save"
          :action="addPrice"
        />
      </v-col>
    </v-row>
    <v-data-table
      :headers="headerPrices"
      :items="prices"
      class="striped purple lighten-5"
      dense
      hide-default-footer
      :items-per-page="-1"
    >
      <template #[`item.date_beg`]="{ item }">
        {{ $moment(item.date_beg).format("YYYY-MM-DD") }}
      </template>
    </v-data-table>
  </td>
</template>

<script lang="ts">
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import DatePickerVVue from "@/components/basic/DatePickerV.vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { IBillingPrices } from "@/types/database/schemas/billing";
import { defineComponent, ref } from "vue";
import { DataTableHeader } from "vuetify";

export default defineComponent({
  components: { BtnIconsVVue, DatePickerVVue },
  props: {
    kod_resource: { type: Number, required: true },
    colspan: Number,
  },
  setup(props) {
    const { r_get, r_insert } = dataApiComposition();
    const prices = ref<IBillingPrices[]>([]);
    const billing = ref("");
    const date_beg = ref("");
    const addPrice = () =>
      r_insert({
        to: "billing.prices",
        fields: {
          kod_resource: props.kod_resource,
          billing: billing.value,
          date_beg: date_beg.value,
        },
      });
    const getPrice = () =>
      r_get<keyof IBillingPrices>({
        from: "billing.prices",
        sort: ["-date_beg"],
        filter: {
          kod_resource: props.kod_resource,
        },
      }).then((r: IBillingPrices[]) => {
        prices.value = r;
      });
    const headerPrices: DataTableHeader[] = [
      { value: "date_beg", text: "действует с" },
      { value: "billing", text: "Расценки" },
    ];
    const setDate = (a: string) => {
      date_beg.value = a;
    };
    getPrice();
    return {
      getPrice,
      addPrice,
      setDate,
      headerPrices,
      prices,
      billing,
      date_beg,
    };
  },
});
</script>
