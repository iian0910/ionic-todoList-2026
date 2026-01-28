<template>
  <ion-page>
    <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-buttons slot="start" class="icon_area" @click="back">
            <ion-icon class="icon_area_img" aria-hidden="true" size="large" :icon="arrowBackOutline"/>
          </ion-buttons>
          <ion-title class="page_title">新增項目</ion-title>
          <ion-buttons slot="end" class="icon_area"></ion-buttons>
        </ion-toolbar>
      </ion-header>
    <ion-content :fullscreen="true">
      <InfoInput @add-todo="addDBInfo"/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonIcon
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import InfoInput from '@/components/InfoInput.vue';
import { TodoItem } from '@/js/interface';
import dayjs from 'dayjs';
import { useUserStore } from '@/store';
import { openToast } from '@/composible/util';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/js/firebaseDB';

const store = useUserStore()

const router = useRouter()

// data

// methods
const addDBInfo = async(todo: TodoItem) => {
  const dateTimeString = `${todo.date}${todo.time}`
  const timestamp = dayjs(dateTimeString).valueOf().toString()
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

  try {
    await setDoc(doc(db, "todoList", userName, todo.date, timestamp), {
      id: timestamp,
      date: todo.date,
      time: todo.time,
      content: todo.content,
      iso8601: todo.iso8601,
      check: false
    });

    openToast('新增成功', 'success')
  } catch (error) {
    openToast(error as string, 'danger')
  }
}

const back = () => {
  router.push({name: 'home'})
}
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
.input_title {
  font-size: 18px;
}
</style>
