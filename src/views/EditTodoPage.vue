<template>
  <ion-page>
    <ion-header class="ion-no-border">
        <ion-toolbar class="ion-toolbar">
          <ion-buttons slot="start" class="icon_area" @click="back">
            <ion-icon class="icon_area_img" aria-hidden="true" size="large" :icon="arrowBackOutline"/>
          </ion-buttons>
          <ion-title class="page_title">編輯項目</ion-title>
          <ion-buttons slot="end" class="icon_area"></ion-buttons>
        </ion-toolbar>
      </ion-header>
    <ion-content :fullscreen="true" class="page-content">
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
import { db } from '../js/firebaseDB';
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where
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

  const q = query(
    collection(db, "todoList", userName, "todos"),
    where("id", "==", id)
  )

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      todo.value.id = querySnapshot.docs[0].data().id,
      todo.value.date = querySnapshot.docs[0].data().date,
      todo.value.time = querySnapshot.docs[0].data().time,
      todo.value.content = querySnapshot.docs[0].data().content
      todo.value.check = querySnapshot.docs[0].data().check
    } else {
      openToast('資料不存在', 'danger')
    }
  } catch (error) {
    openToast(error as string, 'danger')
  }
}

const updateDBInfo = async(todo: TodoItem) => {
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

  
  try {
    const q = query(
      collection(db, "todoList", userName, "todos"),
      where("id", "==", currentID.value)
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      await updateDoc(doc(db, "todoList", userName, "todos", querySnapshot.docs[0].id), {...todo} )
    }

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
