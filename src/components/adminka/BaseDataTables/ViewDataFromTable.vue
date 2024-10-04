<template>
  <div>
    <DataTableV
      multi-sort
      calculate-widths
      fixed-header
      height="80vh"
      :items-per-page="15"
      :caption="`Данные из ${space}.${table}`"
      :items="workData"
    >
      <template #expanded-top="">
        <v-row class="ma-1">
          <v-col cols="auto" class="pa-1">
            <BtnIconsV
              color="green"
              icon="mdi-microsoft-excel"
              title="Скачать XLSX"
              :action="genExcel"
            />
            <BtnIconsV
              :disabled="!addLevel()"
              color="purple"
              :action="addModalRow"
              icon="add"
              title="Добавить"
            />
          </v-col>
        </v-row>
      </template>
      <template
        v-for="k in fieldList
          .filter((e) => e.data_type === 'boolean')
          .map((e) => e.column_name)"
        #[`item.${k}`]="{ item }"
      >
        <v-simple-checkbox :key="'_' + k" v-model="item[k]" disabled />
      </template>

      <template #[`item.id`]="{ item }">
        <v-menu offset-x max-width="80px">
          <template #activator="{ on: menu, attrs }">
            <v-tooltip top>
              <template #activator="{ on: tooltip }">
                <v-btn
                  small
                  block
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                >
                  {{ item.id }}
                </v-btn>
              </template>
              <span>При нажатии на id появятся кнопки редактирования</span>
            </v-tooltip>
          </template>

          <v-expand-transition>
            <v-card>
              <v-card-actions>
                <BtnIconsV
                  :action="() => deleteRow(pkey, item[pkey])"
                  :disabled="!editLevel()"
                  title="Удалить запись"
                  color="red"
                  icon="delete"
                />
                <BtnIconsV
                  :action="() => editModalRow(item)"
                  :disabled="!editLevel()"
                  title="Редактировать запись"
                  color="green"
                  icon="edit"
                />
              </v-card-actions>
            </v-card>
          </v-expand-transition>
        </v-menu>
      </template>
    </DataTableV>
    <v-dialog v-model="editDialog" persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Реадктировать запись {{ table }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                v-for="field in fieldList"
                :key="'editfield_' + field.column_name"
                cols="12"
              >
                <span v-if="field.data_type.includes('timestamp')">{{
                  $moment(dataRows[modalRow][field.column_name]).format(
                    "YYYY-MM-DD HH:mm:ss (локальное время)"
                  )
                }}</span>
                <CheckBoxTitleV
                  v-if="field.data_type === 'boolean'"
                  v-model="dataRows[modalRow][field.column_name]"
                  :label="field.column_name"
                />

                <v-text-field
                  v-else-if="['integer', 'numeric'].includes(field.data_type)"
                  v-model.number="dataRows[modalRow][field.column_name]"
                  type="number"
                  :readonly="
                    field.column_name === pkey || field.column_name === 'id'
                  "
                  :color="field.column_name === pkey ? 'red' : 'green'"
                  :hint="
                    field.data_type +
                    (field.column_name === pkey ? ' (Primary Key)' : '')
                  "
                  outlined
                  dense
                  :label="field.column_name"
                />
                <v-textarea
                  v-else
                  v-model="dataRows[modalRow][field.column_name]"
                  counter
                  :color="field.column_name === pkey ? 'red' : 'green'"
                  :hint="
                    field.data_type +
                    (field.column_name === pkey ? ' (Primary Key)' : '')
                  "
                  outlined
                  dense
                  :label="field.column_name"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red darken-1" text @click="editDialog = false">
            Отмена
          </v-btn>
          <v-btn
            v-if="modalRow === 'edit'"
            color="blue darken-1"
            text
            @click="saveModalRow"
          >
            Сохранить
          </v-btn>
          <v-btn v-else color="purple darken-1" text @click="addRow">
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import BtnIconsV from "@/components/basic/BtnIconsV.vue";
import CheckBoxTitleV from "@/components/basic/CheckBoxTitleV.vue";
import DataTableV from "@/components/basic/DataTableV.vue";
import { routeAccessLevelCalculate } from "@/compositionApi/accessLevelCalculate";
import { dataApiComposition, toast } from "@/compositionApi/dataApi";
import { dataToExcel } from "@/compositionApi/dataToExcel";
import { EKNOWLEGEBASE } from "@/const/schemaEnums";
import projectDebug from "@/functions/projectDebug";
import { usePostgreStore } from "@/store/modules/postgre";
import { PropType, computed, ref, toRefs } from "vue";
type TSTATUS = "edit" | "select" | "new";
type TFieldData = Record<string, string | number[]>;
const emit = defineEmits(["getDataTableLocal"]);
const { getXLSX } = dataToExcel();
const props = defineProps({
  space: { type: String, default: "public" },
  table: { type: String, default: "bz_users" },
  workData: {
    type: Array as PropType<Record<string, string>[]>,
    required: true,
  },
});
const { primarykey, fieldList } = toRefs(usePostgreStore());
const { editLevel, addLevel } = routeAccessLevelCalculate();
const { r_insert, r_update, r_delete } = dataApiComposition();
const modalRow = ref<TSTATUS>("edit");
const editDialog = ref(false);
const dataRows = ref<Record<TSTATUS, TFieldData>>({
  select: {},
  edit: {},
  new: {},
});
const pkey = computed((): string => {
  let key = "";
  const pk = primarykey.value;
  if (pk.length > 0) {
    key = pk[0].column_name;
  }
  return key;
});
const genExcel = () => {
  getXLSX(`${props.space}_${props.table}_${Date.now()}`, props.workData);
};
const getDataTableLocal = (t) => emit("getDataTableLocal", t);
const addModalRow = () => {
  modalRow.value = "new";
  editDialog.value = true;
};
const deleteRow = (key: string, val: number) => {
  const t = props.table;
  if (
    !confirm(
      "Подтвердите удаление записи " + key + "=" + val + " из таблицы " + t
    )
  ) {
    return;
  }
  const fields: Record<string, string | number[]> = {};
  fields[key] = "" + val;
  r_delete({
    from: (props.space + "." + t) as EKNOWLEGEBASE,
    filter: {
      ...fields,
    },
  }).then((r) => {
    projectDebug(r);
    if (r.count === 1) {
      toast.info(
        "Запись " + key + "=" + val + " из " + t + "<br>удалена успешно"
      );
      getDataTableLocal(t);
    } else {
      toast.warning(r.err.detail);
    }
  });
  projectDebug("Удаление ", key, val);
};
const editModalRow = (e: Record<string, string | number[]>) => {
  modalRow.value = "edit";
  dataRows.value.select = e;
  dataRows.value.edit = { ...e };
  editDialog.value = true;
};
const addRow = () => {
  const t = props.table;
  const row = { ...dataRows.value.new };
  fieldList.value.forEach((e: FieldList) => {
    if (e.column_name in row) {
      if (e.data_type === "ARRAY") {
        if (row[e.column_name]) {
          row[e.column_name] = String(row[e.column_name])
            .split(",")
            .map((e: string) => +e.trim());
        }
      }
    }
  });

  r_insert({
    to: (props.space + "." + t) as EKNOWLEGEBASE,
    fields: {
      ...row,
    },
  }).then((r) => {
    projectDebug(r);
    dataRows.value.new = {};
    if (r.count === 1) {
      toast.info("Запись добавлена в таблицу " + t);
      dataRows.value.new = {};
      getDataTableLocal(t);
    } else {
      toast.error(r.err.detail);
    }
  });
  // .catch((err) => toast.error(err.message));
};

const saveModalRow = () => {
  if (!pkey.value) {
    toast.warning("В таблице не найден уникальный ключ");
    return;
  }
  const save = dataRows.value.select;
  const edit = dataRows.value.edit;
  const fields: Record<string, string | number[]> = {};
  const seter: Record<string, string | number[]> = {};
  for (const e in edit) {
    if (edit[e] !== save[e]) {
      seter[e] = edit[e];
    }
  }
  fields[pkey.value] = "" + save[pkey.value];
  r_update({
    to: (props.space + "." + props.table) as EKNOWLEGEBASE,
    set: {
      ...seter,
    },
    filter: {
      ...fields,
    },
  }).then((r) => {
    projectDebug(r);
    if (r.count === 1) {
      toast.info("Запись обновлена " + save[pkey.value]);
      getDataTableLocal(props.table);
    } else {
      toast.error(r.err.detail);
    }
  });
  editDialog.value = false;
};
</script>
