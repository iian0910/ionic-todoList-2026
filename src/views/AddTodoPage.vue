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
            <ion-button fill="solid" @click="addDBInfo">新增</ion-button>
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
  IonModal
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { ref } from 'vue';
import dayjs from "dayjs"
import { db } from '../js/firebaseDB';
import {
  doc,
  setDoc
} from "firebase/firestore";
import { TodoItem } from '@/js/interface'
import { useRouter } from 'vue-router';
import { openToast } from '@/composible/util';
import { useUserStore } from '@/store';

const router = useRouter()
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

// methods
const addDBInfo = async() => {
  const dateTimeString = `${todo.value.date}${todo.value.time}`
  const timestamp = dayjs(dateTimeString).valueOf().toString()
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

  try {
    await setDoc(doc(db, "todoList", userName, todo.value.date, timestamp), {
      id: timestamp,
      date: todo.value.date,
      time: todo.value.time,
      content: todo.value.content,
      check: false
    });

    openToast('新增成功', 'success')
  } catch (error) {
    openToast(error as string, 'danger')
  } finally {
    todo.value = {
      id: '',
      date: '',
      time: '',
      content: '',
      check: false
    }
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
