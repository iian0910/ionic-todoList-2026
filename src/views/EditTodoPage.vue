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
      <div class="ion-padding">
        <div class="ion-margin-bottom">
          <div class="input_title">日期</div>
          <ion-input
            :value="todo.date"
            @update:modelValue="todo.date = $event"
            label-placement="floating"
            fill="outline"
            id="open-date-modal"
          />
          <ion-modal
            trigger="open-date-modal"
            :initial-breakpoint="0.4"
            :breakpoints="[0.4]"
            handle-behavior="cycle"
            @willPresent="onModalDateOpen"
          >
            <ion-content class="ion-padding">
              <div class="ion-margin-top">
                <ion-datetime
                  presentation="date"
                  :value="dateISO"
                  @ionChange="onDateChange"
                />
              </div>
            </ion-content>
          </ion-modal>
        </div>
        <div class="ion-margin-bottom">
          <div class="input_title">時間</div>
          <ion-input
            :value="todo.time"
            @update:modelValue="todo.time = $event"
            label-placement="floating"
            fill="outline"
            id="open-time-modal"/>
          
          <ion-modal
            trigger="open-time-modal"
            :initial-breakpoint="0.3"
            :breakpoints="[0.3]"
            handle-behavior="cycle"
            @willPresent="onModalTimeOpen"
          >
            <ion-content class="ion-padding">
              <div class="ion-margin-top">
                <ion-datetime
                  presentation="time"
                  :value="timeISO"
                  @ionChange="onTimeChange"
                />
              </div>
            </ion-content>
          </ion-modal>
        </div>
        <div class="ion-margin-bottom">
          <div class="input_title">內容</div>
          <ion-input
            :value="todo.content"
            @update:modelValue="todo.content = $event"
            label-placement="floating"
            fill="outline"/>
        </div>

        <ion-toolbar>
          <ion-buttons slot="primary">
            <ion-button fill="solid" @click="updateDBInfo">更新</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </div>
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
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonDatetime,
  IonModal,
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
const dateISO = ref<string>('')
const timeISO = ref<string>('')

const currentDate = ref<string>('')
const currentTime = ref<string>('')
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
      todo.value.date = docSnap.data().date,
      todo.value.time = docSnap.data().time,
      todo.value.content = docSnap.data().content
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

const updateDBInfo = async() => {
  const dateTimeString = `${todo.value.date}${todo.value.time}`
  const timestamp = dayjs(dateTimeString).valueOf().toString()
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

  await deleteTodo(currentDate.value, currentID.value)
  
  try {
    await setDoc(doc(db, "todoList", userName, currentDate.value, timestamp), {
      id: timestamp,
      date: todo.value.date,
      time: todo.value.time,
      content: todo.value.content,
      check: false
    });

    openToast('新增成功', 'success')
    back()
  } catch (error) {
    openToast(error as string, 'danger')
  }
}

const onModalDateOpen = () => {
  dateISO.value = dayjs(currentDate.value).format("YYYY/MM/DDTHH:mm:ss")
  todo.value.date = dayjs().format('YYYY-MM-DD')
}

const onModalTimeOpen = () => {
  timeISO.value = dayjs(currentTime.value).format("YYYY/MM/DDTHH:mm:ss")
  todo.value.time = dayjs().format('HH:mm')
}

const onDateChange = (e: CustomEvent) => {
  const iso = e.detail.value
  if (!iso) return

  dateISO.value = iso                  // 給 ion-datetime
  todo.value.date = dayjs(iso).format('YYYY-MM-DD') // 給自己
}

const onTimeChange = (e: CustomEvent) => {
  const iso = e.detail.value
  if (!iso) return

  timeISO.value = iso                  // 給 ion-datetime
  todo.value.time = dayjs(iso).format('HH:mm') // 給自己
}

const back = () => {
  router.push({name: 'home'})
}

// ionic 生命週期
onIonViewWillEnter(() => {
  currentDate.value = route.query.date as string
  currentTime.value = route.query.time as string
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
