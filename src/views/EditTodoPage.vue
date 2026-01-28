<template>
  <ion-page>
    <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-buttons slot="start" class="icon_area" @click="back">
            <ion-icon class="icon_area_img" aria-hidden="true" size="large" :icon="arrowBackOutline"/>
          </ion-buttons>
          <ion-title class="page_title">編輯項目</ion-title>
          <ion-buttons slot="end" class="icon_area"></ion-buttons>
        </ion-toolbar>
      </ion-header>
    <ion-content :fullscreen="true">
      <InfoInput
        @update-todo="updateDBInfo"
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
  IonIcon,
  onIonViewWillEnter
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { ref } from 'vue';
import dayjs from "dayjs"
import { db } from '../js/firebaseDB';
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import { TodoItem } from '@/js/interface'
import { useRoute, useRouter } from 'vue-router';
import { openToast } from '@/composible/util';
import { useUserStore } from '@/store';
import InfoInput from '@/components/InfoInput.vue';

const router = useRouter()
const route = useRoute()
const store = useUserStore()

// data
const todo = ref<TodoItem>({
  id: '',
  date: '',
  time: '',
  content: '',
  check: false
})
const currentDate = ref<string>('')
const currentID = ref<string>('')

// mounted
const getCurrentTodo = async(date: string, id: string) => {
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

  try {
    const docRef = doc(db, "todoList", userName, date, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      todo.value.id = docSnap.data().id,
      todo.value.date = docSnap.data().date,
      todo.value.time = docSnap.data().time,
      todo.value.content = docSnap.data().content,
      todo.value.iso8601 = docSnap.data().iso8601
    } else {
      openToast('資料不存在', 'danger')
    }

  } catch (error) {
    openToast(error as string, 'danger')
  }
}

const deleteTodo = async(date: string, id: string) => {
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

  try {
    await deleteDoc(doc(db, "todoList", userName, date, id))
  } catch (error) {
    console.error("Error getting documents:", error);
  }
}

const updateDBInfo = async(todo: TodoItem) => {
  const dateTimeString = `${todo.date}${todo.time}`
  const timestamp = dayjs(dateTimeString).valueOf().toString()
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

  await deleteTodo(currentDate.value, currentID.value)
  
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
    back()
  } catch (error) {
    openToast(error as string, 'danger')
  }
}

const back = () => {
  router.push({name: 'home'})
}

// ionic 生命週期
onIonViewWillEnter(() => {
  currentDate.value = route.query.date as string
  currentID.value = route.params.id as string

  getCurrentTodo(currentDate.value, currentID.value)
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
.input_title {
  font-size: 18px;
}
</style>
