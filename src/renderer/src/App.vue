<template>
  <!-- <div id= "app"> -->
      <q-layout view="hHh lpr fFf">
        <Header />
        <q-page-container>
          <ContentArea />
          <router-view />
        </q-page-container>
      </q-layout>
  <!-- </div> -->
</template>

<script setup>
import './assets/base.css'
import Header from './components/Header.vue'
import ContentArea from './components/ContentArea.vue'
</script>

<style>
@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");

#app, html {
  font-family: Pretendard, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  font-size: 16px;
}
</style>
