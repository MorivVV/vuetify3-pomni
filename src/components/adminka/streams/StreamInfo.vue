<template>
  <tr class="ant-table-row ant-table-row-level-0" data-row-key="0">
    <td class="">
      <span
        class="ant-table-row-indent indent-level-0"
        style="padding-left: 0px"
      />{{ chanelName }}
    </td>
    <td class="">
      <a href="##" @click="playerStart">{{ streamName }}</a>
    </td>
    <td class="">
      {{ stream.publisher.clientId }}
    </td>
    <td class="">
      {{ stream.publisher.ip }}
    </td>
    <td class="">
      {{ stream.publisher.audio.codec }}
    </td>
    <td class="">
      {{ stream.publisher.audio.samplerate }}
    </td>
    <td class="">
      {{ stream.publisher.audio.channels }}
    </td>
    <td class="">
      {{ stream.publisher.video.codec }}
    </td>
    <td class="">
      {{ stream.publisher.video.width }}x{{ stream.publisher.video.height }}
    </td>
    <td class="">
      {{ stream.publisher.video.fps }}
    </td>
    <td class="">
      {{ $moment(stream.publisher.connectCreated).fromNow() }}
    </td>
    <td class="">
      {{ stream.subscribers.length }}
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    stream: { type: Object as PropType<StreamMediaChanel>, required: true },
    chanelName: String,
    streamName: String,
  },
  methods: {
    playerStart() {
      this.$emit("viewPlayer");
    },
  },
});
</script>
