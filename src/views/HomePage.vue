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
        <date-picker/>
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

import db from '../js/firebaseDB';
import {
  addDoc,
  collection,
  getDocs
} from "firebase/firestore";
import DatePicker from '@/components/DatePicker.vue';

// Interface
interface User {
  id: string,
  name: string,
  age: number,
  city: string
}

// data
const nowDate = ref('')
const dbData = ref<User[]>([])

// methods
const addDBInfo = async() => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "Bob",
      age: 26,
      city: "New Taipei"
    });
    console.log("新增成功，文檔 ID:", docRef.id);

    await getDBInfo()
  } catch (error) {
    console.error("新增失敗:", error);
  }
  
}

const getDBInfo = async() => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    console.log('typeof =>', typeof querySnapshot)

    if (querySnapshot.empty) {
      console.log("集合是空的!");
    } else {
      dbData.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        age: doc.data().age,
        city: doc.data().city
      }))

      console.log('result =>', dbData.value)
    }
  } catch (error) {
    console.error("Error getting documents:", error);
  }
}

// mounted
onMounted(() => {
  nowDate.value = dayjs().format("YYYY/MM")
  getDBInfo()
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