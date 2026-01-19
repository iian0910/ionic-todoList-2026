<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar color="primary" slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
          <ion-label>首頁</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="account" href="/tabs/account">
          <ion-icon aria-hidden="true" :icon="walletOutline" />
          <ion-label>帳戶</ion-label>
        </ion-tab-button>

        <ion-tab-button disabled/>

        <ion-tab-button tab="bill" href="/tabs/bill">
          <ion-icon aria-hidden="true" :icon="barcodeOutline" />
          <ion-label>發票</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="chart" href="/tabs/chart">
          <ion-icon aria-hidden="true" :icon="statsChartOutline" />
          <ion-label>圖表</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>

    <ion-fab slot="fixed" horizontal="center" vertical="bottom">
      <ion-fab-button color="warning">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, IonFab, IonFabButton } from '@ionic/vue';
import { walletOutline, statsChartOutline, add, homeOutline, barcodeOutline } from 'ionicons/icons';

</script>
