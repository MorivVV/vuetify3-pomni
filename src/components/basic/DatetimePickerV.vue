<template>
  <v-dialog v-model="display" :width="dialogWidth">
    <template #activator="{ on }">
      <v-text-field
        dense
        v-bind="textFieldProps"
        :disabled="disabled"
        hide-details
        :label="label"
        :loading="loading"
        outlined
        readonly
        :value="formattedDatetime"
        v-on="on"
      >
        <template #progress>
          <slot name="progress">
            <v-progress-linear
              absolute
              color="primary"
              height="2"
              indeterminate
            />
          </slot>
        </template>
      </v-text-field>
    </template>

    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs v-model="activeTab" fixed-tabs>
          <v-tab key="calendar">
            <slot name="dateIcon">
              <v-icon>event</v-icon>
            </slot>
          </v-tab>
          <v-tab key="timer" :disabled="dateSelected">
            <slot name="timeIcon">
              <v-icon>access_time</v-icon>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              v-model="date"
              v-bind="datePickerProps"
              full-width
              @input="showTimePicker"
            />
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              ref="timer"
              v-model="time"
              class="v-time-picker-custom"
              v-bind="timePickerProps"
              full-width
            />
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <slot name="actions" :parent="this">
          <v-btn color="grey lighten-1" text @click.native="clearHandler">{{
            clearText
          }}</v-btn>
          <v-btn color="green darken-1" text @click="okHandler">{{
            okText
          }}</v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { format, parse } from "date-fns";
import { computed, defineComponent, onMounted, ref, toRefs, watch } from "vue";

const DEFAULT_DATE = "";
const DEFAULT_TIME = "00:00:00";
const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
const DEFAULT_TIME_FORMAT = "HH:mm:ss";
const DEFAULT_DIALOG_WIDTH = 340;
const DEFAULT_CLEAR_TEXT = "CLEAR";
const DEFAULT_OK_TEXT = "OK";

export default defineComponent({
  name: "VDatetimePicker",
  model: {
    prop: "datetime",
    event: "input",
  },
  props: {
    datetime: {
      type: [Date, String],
      default: null,
    },
    disabled: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
    label: {
      type: String,
      default: "",
    },
    dialogWidth: {
      type: Number,
      default: DEFAULT_DIALOG_WIDTH,
    },
    dateFormat: {
      type: String,
      default: DEFAULT_DATE_FORMAT,
    },
    timeFormat: {
      type: String,
      default: "HH:mm",
    },
    clearText: {
      type: String,
      default: DEFAULT_CLEAR_TEXT,
    },
    okText: {
      type: String,
      default: DEFAULT_OK_TEXT,
    },
    textFieldProps: {
      type: Object,
    },
    datePickerProps: {
      type: Object,
    },
    timePickerProps: {
      type: Object,
    },
  },
  setup (props, { emit }) {
    const timer = ref();
    const { datetime } = toRefs(props);
    const display = ref(false);
    const activeTab = ref(0);
    const date = ref(DEFAULT_DATE);
    const time = ref(DEFAULT_TIME);
    const dateTimeFormat = computed(
      () => props.dateFormat + " " + props.timeFormat
    );
    const defaultDateTimeFormat = computed(
      () => DEFAULT_DATE_FORMAT + " " + DEFAULT_TIME_FORMAT
    );
    const selectedDatetime = computed(() => {
      if (date.value && time.value) {
        let datetimeString = date.value + " " + time.value;
        if (time.value.length === 5) {
          datetimeString += ":00";
        }
        return parse(datetimeString, defaultDateTimeFormat.value, new Date());
      } else {
        return null;
      }
    });
    const formattedDatetime = computed(() =>
      selectedDatetime.value
        ? format(selectedDatetime.value, dateTimeFormat.value)
        : ""
    );
    const showTimePicker = () => {
      activeTab.value = 1;
    };
    const dateSelected = computed(() => !date.value);
    const resetPicker = () => {
      display.value = false;
      activeTab.value = 0;
      if (timer.value) {
        timer.value.selectingHour = true;
      }
    };
    const okHandler = () => {
      resetPicker();
      emit("input", selectedDatetime.value);
    };
    const clearHandler = () => {
      resetPicker();
      date.value = DEFAULT_DATE;
      time.value = DEFAULT_TIME;
      emit("input", null);
    };

    const init = () => {
      if (!props.datetime) {
        return;
      }

      let initDateTime;
      if (props.datetime instanceof Date) {
        initDateTime = props.datetime;
      } else if (
        typeof props.datetime === "string" // || props.datetime instanceof String
      ) {
        // see https://stackoverflow.com/a/9436948
        initDateTime = parse(props.datetime, dateTimeFormat.value, new Date());
      }

      date.value = format(initDateTime, DEFAULT_DATE_FORMAT);
      time.value = format(initDateTime, DEFAULT_TIME_FORMAT);
    };
    onMounted(() => init());
    watch(datetime, init);
    return {
      display,
      activeTab,
      date,
      time,
      dateTimeFormat,
      defaultDateTimeFormat,
      formattedDatetime,
      dateSelected,
      clearHandler,
      showTimePicker,
      okHandler,
    };
  },
});
</script>
