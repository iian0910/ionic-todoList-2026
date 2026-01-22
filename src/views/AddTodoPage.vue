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
      <div class="px-3">
        <div class="my-3">
          <div class="input_title w-20 flex self-center">日期</div>
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
        <div class="my-3">
          <div class="input_title w-20 flex self-center">時間</div>
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
        <div class="my-3">
          <div class="input_title w-20 flex self-center">內容</div>
          <ion-input
            :value="todo.content"
            @update:modelValue="todo.content = $event"
            label-placement="floating"
            fill="outline"/>
        </div>

        <ion-toolbar>
          <ion-buttons slot="primary">
            <ion-button fill="solid" @click="addDBInfo">新增</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import router from '@/router';
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
  IonModal
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { ref } from 'vue';
import dayjs from "dayjs"
import db from '../js/firebaseDB';
import {
  doc,
  setDoc
} from "firebase/firestore";
import { TodoItem } from '@/js/interface'

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

// mounted
const addDBInfo = async() => {
  const timestamp = Date.now().toString()
  const userName = 'ianFan'

  try {
    await setDoc(doc(db, "todoList", userName, todo.value.date, timestamp), {
      id: timestamp,
      date: todo.value.date,
      time: todo.value.time,
      content: todo.value.content,
      check: false
    });

    console.log("新增成功");
  } catch (error) {
    console.error("新增失敗:", error);
  }
}

const onModalDateOpen = () => {
  dateISO.value = dayjs(new Date()).format("YYYY/MM/DDTHH:mm:ss")
  todo.value.date = dayjs().format('YYYY-MM-DD')
}

const onModalTimeOpen = () => {
  timeISO.value = dayjs(new Date()).format("YYYY/MM/DDTHH:mm:ss")
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
  router.push({path: '/tabs/home'})
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
