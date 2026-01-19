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
      <ion-header class="ion-no-border page_title">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Tab 1</ion-title>
          <ion-buttons slot="end">
            <ion-icon  class="search" aria-hidden="true" size="large" :icon="searchOutline"/>
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
import { searchOutline } from 'ionicons/icons';
</script>

<style lang="scss" scoped>
.search {
  padding: 8px;
}
.page_title {
  text-align: center;
}
</style>