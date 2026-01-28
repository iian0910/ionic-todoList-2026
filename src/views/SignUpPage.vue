<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="center-container">
        <ApplyPage
          :page-title="'Sing Up'"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent
} from '@ionic/vue';
import ApplyPage from '@/components/ApplyPage.vue';

// data

// methods
</script>

<style lang="scss" scoped>
.center-container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>