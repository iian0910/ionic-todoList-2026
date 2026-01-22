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
        <date-picker
          @selected-date="getDBInfo"
        />
      </ion-header>
      <ion-content :fullscreen="true">
        <DynamicScroller 
          class="scroller"
          :items="todos"
          :min-item-size="200"
          v-if="todos.length"
        >
          <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :size-dependencies="[item.content]"
              :data-index="index"
            >
              <div class="card-wrapper">
                <ion-card class="ion-padding">
                  <ion-card-header class="ion-no-padding ion-padding-vertical">
                    <ion-card-title>{{ item.date }}</ion-card-title>
                  </ion-card-header>
      
                  <ion-card-content class="ion-no-padding ion-padding-vertical">
                    <ion-text>
                      <h1>
                        {{ item.content }}
                      </h1>
                    </ion-text>
                  </ion-card-content>
      
                  <div class="ion-display-flex ion-justify-content-end">
                    <ion-button fill="outline">
                      <ion-icon :icon="create"></ion-icon>
                      編輯
                    </ion-button>
                    <ion-button fill="outline">
                      <ion-icon :icon="trashOutline"></ion-icon>
                      刪除
                    </ion-button>
                  </div>
                </ion-card>
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller >
        <div class="flex flex-col justify-center items-center h-full" v-else>
          <ion-icon :icon="fileTrayFullOutline" class="empty_status"></ion-icon>
          <div class="empty_title">目前尚無資料...</div>
        </div>
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
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText
} from '@ionic/vue';
import { calendarOutline, create, fileTrayFullOutline, searchOutline, trashOutline } from 'ionicons/icons';
import dayjs from "dayjs"
import { onMounted, ref } from 'vue';
import db from '../js/firebaseDB';
import {
  collection,
  getDocs
} from "firebase/firestore";
import DatePicker from '@/components/DatePicker.vue';
import { TodoItem } from '@/js/interface'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'

// data
const nowDate = ref('')
const todos = ref<TodoItem[]>([])

// methods
const getDBInfo = async(dateStr: string) => {
  const dateKey = dayjs(dateStr).format("YYYY-MM-DD")
  try {
    const querySnapshot = await getDocs(collection(db, "todoList", dateKey, "todos"));

    if (querySnapshot.empty) {
      todos.value= []
    } else {
      todos.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        date: doc.data().date,
        time: doc.data().time,
        content: doc.data().content, 
        check: doc.data().check
      }))
    }

  } catch (error) {
    console.error("Error getting documents:", error);
  }
}

// mounted
onMounted(() => {
  nowDate.value = dayjs().format("YYYY/MM")
  getDBInfo(dayjs(new Date()).format("YYYY-MM-DD"))
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
.empty_status {
  width: 250px;
  height: 250px;
  margin: 0 auto;
  color: #d7d7d7;
}
.empty_title {
  font-size: 24px;
  text-align: center;
}

.card-wrapper {
  padding: 2px 0; /* 上下間距 */
}
/* 或者直接設定 ion-card 的 margin */
.scroller ion-card {
}
</style>