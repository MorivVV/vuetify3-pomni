<template>
  <BtnIconsVVue
    v-if="subScribe"
    color="white"
    colorbtn="green"
    icon="notifications_active"
    :action="removeSubscribe"
    title="Отписаться"
  />
  <BtnIconsVVue
    v-else
    color="white"
    colorbtn="btn-small grey"
    icon="notifications_none"
    :action="addSubscribe"
    title="Подписаться"
  />
</template>

<script lang="ts">
import BtnIconsVVue from "@/components/basic/BtnIconsV.vue";
import { defineComponent } from "vue";
import { dataApiComposition } from "@/compositionApi/dataApi";
import { useAutorizationStore } from "@/store/modules/autorization";
import { useWebsocketStore } from "@/store/modules/websocket";
import { mapGetters, mapState } from "pinia";

export default defineComponent({
  components: {
    BtnIconsVVue,
  },
  props: {
    room: { type: [Number, String], default: 1 },
  },
  setup() {
    const { r_insert, r_delete } = dataApiComposition();
    return { r_insert, r_delete };
  },
  computed: {
    ...mapState(useWebsocketStore, ["ws_subscribes"]),
    ...mapGetters(useAutorizationStore, ["userId", "userToken"]),
    subScribe() {
      let subScribe = false;
      if (
        this.ws_subscribes.find(
          (e: { kod_room: number }) => e.kod_room === +this.room
        )
      ) {
        subScribe = true;
      }
      return subScribe;
    },
  },
  methods: {
    addSubscribe() {
      this.r_insert({
        to: "ws_subscribes",
        fields: {
          kod_user: this.userId,
          kod_room: this.room,
        },
      })
        // .then(() => this.$parent.getSubscribes())
        .then(() => this.$emit("getSubscribes"))
        .then(() => this.$toast({ html: "Подписка включена" }));
    },
    removeSubscribe() {
      this.r_delete({
        from: "ws_subscribes",
        filter: {
          kod_user: {
            fields: ["id"],
            from: "bz_users",
            filter: { session_token: `=:${this.userToken}` },
          },
          kod_room: `=:${this.room}`,
        },
      })
        .then(() => this.$emit("getSubscribes"))
        .then(() => this.$toast({ html: "Подписка отключена" }));
    },
  },
});
</script>
