<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar
        slot="bottom"
        class="custom-tab-bar"
      >
        <!-- 左邊 tab（之後你可以加 icon） -->
        <ion-tab-button tab="home">
          <ion-icon :icon="calendarOutline"/>
        </ion-tab-button>

        <ion-tab-button class="tab-hole"/>

        <!-- 右邊 tab -->
        <ion-tab-button tab="calendar" @click="logout">
          <ion-icon :icon="logOutOutline"/>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>

    <ion-fab slot="fixed" horizontal="center" vertical="bottom">
      <ion-fab-button class="fab-add" @click="goToAdd">
        <ion-icon :icon="add" color="fnIcon"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<script setup lang="ts">
import { openToast } from '@/composible/util';
import { auth } from '@/js/firebaseDB';
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonIcon,
  IonPage,
  IonRouterOutlet,
  IonFab,
  IonFabButton
} from '@ionic/vue';
import { signOut } from 'firebase/auth';
import {
  add,
  calendarOutline,
  logOutOutline
} from 'ionicons/icons';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';

const store = useUserStore()
const router = useRouter()

// data

// methods
const logout = async () => {
  try {
    store.saveUserInfo(
      {
        uid: '',
        email: '',
        displayName: '',
        photoURL: ''
      }
    )
    await signOut(auth);
    openToast('成功登出', 'success')

    router.push({name: 'login'})
  } catch (err: any) {
    openToast(err, 'danger')
  }
}

const goToAdd = () => {
  router.push({name: 'addTodo'})
}
</script>

<style lang="scss" scoped>
.custom-tab-bar {
  height: 55px;
  --background: white;
}

/* 挖洞的半圓 */
.custom-tab-bar::before {
  content: '';
  position: absolute;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);
  width: 90px;
  height: 90px;
  background: #F5EBE0;
  border-radius: 50%;
  z-index: 1;
}

/* 中間空位 */
.tab-hole {
  width: 72px;
  pointer-events: none;
}

/* Tab icon 置中好看一點 */
ion-tab-button {
  --color: #999;
  --color-selected: #1f3c4a;
}

.fab-add {
  --background: var(--ion-color-primary);
  width: 64px;
  height: 64px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  border-radius: 32px;
}

ion-fab {
  bottom: 28px; /* 跟凹槽高度對齊 */
}
</style>