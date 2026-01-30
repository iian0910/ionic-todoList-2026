<template>
  <ion-page>
    <ion-header class="ion-no-border">
        <ion-toolbar class="ion-toolbar">
          <ion-buttons slot="start" class="icon_area" @click="back">
            <ion-icon class="icon_area_img" aria-hidden="true" size="large" :icon="arrowBackOutline"/>
          </ion-buttons>
          <ion-title class="page_title">新增項目</ion-title>
          <ion-buttons slot="end" class="icon_area"></ion-buttons>
        </ion-toolbar>
      </ion-header>
    <ion-content :fullscreen="true" class="page-content">
      <InfoInput
        @add-todo="addDBInfo"
        :edit-todo="todo"
      />
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
import { useUserStore } from '@/store';
import { openToast } from '@/composible/util';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/js/firebaseDB';
import { ref } from 'vue';

const store = useUserStore()

const router = useRouter()

// data
const todo = ref<TodoItem>({
  id: '',
  date: '',
  time: '',
  content: '',
  check: false
})

// methods
const addDBInfo = async(todo: TodoItem) => {
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

  try {
    await addDoc(collection(db, "todoList", userName, "todos"), {
      id: crypto.randomUUID(),
      date: todo.date,
      time: todo.time,
      content: todo.content,
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
