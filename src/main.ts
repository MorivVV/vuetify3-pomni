/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import moment from "moment";

const app = createApp(App);

registerPlugins(app);
moment.locale("ru");
app.mount("#app");
