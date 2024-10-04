<template>
  <v-app>
    <SideNavVue :urls="urlRoute" />

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <FooterVue />
  </v-app>
</template>

<script setup lang="ts">
import FooterVue from "@/components/basic/Footer.vue";
import SideNavVue from "@/components/elements/SideNav.vue";
import { AllRoutes, convertRoutes } from "@/router/AllRoutes";
import { Route } from "./types/global";

const urlRoute: Array<Route> = AllRoutes.routes
  .filter((e: Route) => "title" in e && e.title !== "")
  .map((r: Route) => convertRoutes(r))
  .sort((a, b) => a.order - b.order);
</script>

<style>
#toast-container {
  display: block;
  position: fixed;
  z-index: 10000;
}

@media only screen and (max-width: 600px) {
  #toast-container {
    min-width: 100%;
    bottom: 0%;
  }
}

@media only screen and (min-width: 601px) and (max-width: 992px) {
  #toast-container {
    left: 5%;
    bottom: 7%;
    max-width: 90%;
  }
}

@media only screen and (min-width: 993px) {
  #toast-container {
    top: 10%;
    right: 7%;
    max-width: 86%;
  }
}

.toast {
  border-radius: 2px;
  top: 35px;
  width: auto;
  margin-top: 10px;
  position: relative;
  max-width: 100%;
  height: auto;
  min-height: 48px;
  line-height: 1.5em;
  background-color: #323232;
  padding: 10px 25px;
  font-size: 1.1rem;
  font-weight: 300;
  color: #fff;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  cursor: default;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans,
    Ubuntu, Cantarell, Helvetica Neue, sans-serif;
}

.toast .toast-action {
  color: #eeff41;
  font-weight: 500;
  margin-right: -25px;
  margin-left: 3rem;
}

.toast.rounded {
  border-radius: 24px;
}

@media only screen and (max-width: 600px) {
  .toast {
    width: 100%;
    border-radius: 0;
  }
}
.addmodal {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.493);
  z-index: 2;
}
html {
  font-size: 13px;
}
#app {
  height: 0;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
.over-y {
  overflow-y: scroll;
  max-height: 500px;
}
.over-y200 {
  overflow-y: scroll;
  max-height: 200px;
}
p {
  margin: 3px;
}
.pointer {
  cursor: pointer;
}
a.out-link:hover {
  text-decoration: underline dashed;
  background: rgba(152, 140, 253, 0.1);
}
a.out-link {
  text-decoration: underline solid;
}
.card .btn-floating {
  border-radius: 15%;
  margin: 1px;
}
.dropdown-content li {
  clear: both;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;
  min-height: 25px;
  line-height: 1rem;
  width: 100%;
  text-align: left;
}
.autocomplete-content li .highlight {
  color: rgb(241, 101, 20);
}
.dropdown-content li > a,
.dropdown-content li > span {
  font-size: 16px;
  color: #4c26a6;
  display: block;
  line-height: 12px;
  padding: 4px 6px;
}
.v-date-picker-table td {
  padding: 4px;
}
.greenchip .chip {
  color: green;
}
.redchip .chip {
  color: red;
}
.bluechip .chip {
  color: blue;
}
.v-data-table.striped table > tbody > tr:nth-child(odd) {
  background-color: rgba(242, 242, 242, 0.5);
}
</style>
