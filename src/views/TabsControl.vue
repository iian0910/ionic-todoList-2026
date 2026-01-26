<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar color="primary" slot="bottom">
        <ion-tab-button disabled/>
      </ion-tab-bar>
    </ion-tabs>

    <ion-fab slot="fixed" horizontal="center" vertical="bottom">
      <ion-fab-button color="warning" @click="goToAdd">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonIcon, IonPage, IonRouterOutlet, IonFab, IonFabButton } from '@ionic/vue';
import { add } from 'ionicons/icons';

import { useRouter } from 'vue-router';
const router = useRouter()


const goToAdd = () => {
  router.push({name: 'addTodo'})
}
</script>
