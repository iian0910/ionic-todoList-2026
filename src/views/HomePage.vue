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
            <ion-icon class="icon_area_img" aria-hidden="true" size="large" :icon="calendarOutline" @click="addDBInfo"/>
          </ion-buttons>
        </ion-toolbar>
        <date-picker
          @selected-date="getDBInfo"
        />
      </ion-header>
      <ion-content :fullscreen="true">
          <div class="flex flex-col justify-center items-center h-full">
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
  IonIcon
} from '@ionic/vue';
import { calendarOutline, fileTrayFullOutline, searchOutline } from 'ionicons/icons';
import dayjs from "dayjs"
import { onMounted, ref } from 'vue';

import db from '../js/firebaseDB';
import {
  addDoc,
  collection,
  getDocs
} from "firebase/firestore";
import DatePicker from '@/components/DatePicker.vue';

// Interface
interface TodoItem {
  date: Date,
  content: string,
  check: boolean
}

// data
const nowDate = ref('')
const dbData = ref<TodoItem[]>([])
const todo = ref<TodoItem>({
  date: new Date(),
  content: '',
  check: false
})

// methods
const addDBInfo = async() => {
  const today = dayjs(todo.value.date).format("YYYY-MM-DD")
  try {
    const docRef = await addDoc(collection(db, "todoList", today, "todos"), {
      date: todo.value.date,
      content: todo.value.content,
      check: false
    });
    console.log("新增成功，文檔 ID:", docRef.id);

    await getDBInfo(dayjs(new Date()).format("YYYY/MM/DD"))
  } catch (error) {
    console.error("新增失敗:", error);
  }
  
}

const getDBInfo = async(event: string) => {
  console.log('event', event)
  try {
    const querySnapshot = await getDocs(collection(db, "todo"));
    if (querySnapshot.empty) {
      console.log("集合是空的!");
    } else {
      dbData.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        date: doc.data().date,
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
  getDBInfo(dayjs(new Date()).format("YYYY/MM/DD"))
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
</style>