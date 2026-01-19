<template>
  <ion-page>
    <ion-menu content-id="main-content">
      <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-title>Menu Content</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">This is the menu content.</ion-content>
    </ion-menu>
  
    <ion-page id="main-content">
      <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-buttons slot="start" class="icon_area" />
          <ion-title class="page_title">{{ nowDate }}</ion-title>
          <ion-buttons slot="end" class="icon_area">
            <ion-icon class="icon_area_img" aria-hidden="true" size="large" :icon="searchOutline"/>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-icon class="icon_area_img" aria-hidden="true" size="large" :icon="calendarOutline"/>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        ...
      </ion-content>
    </ion-page>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenu,
  IonMenuButton,
  IonButtons,
  IonIcon
} from '@ionic/vue';
import { calendarOutline, searchOutline } from 'ionicons/icons';
import dayjs from "dayjs"
import { onMounted, ref } from 'vue';

// data
const nowDate = ref('')

// mounted
onMounted(() => {
  nowDate.value = dayjs().format("YYYY/MM")
})
</script>

<style lang="scss" scoped>
.icon_area {
  width: 48px;
  height: 48px;
  &_img {
    padding: 8px;
  }
}
.page_title {
  text-align: center;
}
</style>