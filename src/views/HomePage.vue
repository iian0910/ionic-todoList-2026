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
                    <ion-card-title>
                      {{ item.content }}
                    </ion-card-title>
                  </ion-card-header>
      
                  <ion-card-content class="ion-no-padding">
                    <div class="ion-display-flex ion-justify-content-between ion-align-items-center">
                      <ion-text>
                        {{ item.time }}
                      </ion-text>
                      <div class="ion-display-flex ion-justify-content-end">
                        <ion-icon :icon="create" @click="editTodo(item.date, item.time, item.id)"></ion-icon>
                        <ion-icon :icon="checkmarkOutline" @click="check(item)"></ion-icon>
                      <ion-icon :icon="trashOutline" @click="deleteTodo(item)"></ion-icon>
                      </div>
                    </div>
                  </ion-card-content>
      
                  
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
  IonText,
  onIonViewWillEnter
} from '@ionic/vue';
import { calendarOutline, checkmarkOutline, create, fileTrayFullOutline, searchOutline, trashOutline } from 'ionicons/icons';
import dayjs from "dayjs"
import { ref } from 'vue';
import db from '../js/firebaseDB';
import {
  collection,
  deleteDoc,
  doc,
  getDocs
} from "firebase/firestore";
import DatePicker from '@/components/DatePicker.vue';
import { TodoItem } from '@/js/interface'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import { useRouter } from 'vue-router';
import { openToast } from '@/composible/util';

const router = useRouter()

// data
const nowDate = ref('')
const todos = ref<TodoItem[]>([])

// methods
const getDBInfo = async(dateStr: string) => {
  const dateKey = dayjs(dateStr).format("YYYY-MM-DD")
  const userName = 'ianFan'

  try {
    const querySnapshot = await getDocs(collection(db, "todoList", userName, dateKey));
    if (querySnapshot.empty) {
      todos.value= []
    } else {
      todos.value = querySnapshot.docs.map(doc => ({
        id: doc.data().id,
        date: doc.data().date,
        time: doc.data().time,
        content: doc.data().content, 
        check: doc.data().check
      }))
    }

  } catch (error) {
    openToast(error as string, 'danger')
  }
}

const deleteTodo = async(item: TodoItem) => {
  const userName = 'ianFan'

  try {
    await deleteDoc(doc(db, "todoList", userName, item.date, item.id))

    openToast('刪除成功', 'success')
  } catch (error) {
    openToast(error as string, 'danger')
  }

  getDBInfo(item.date)
}

const editTodo = (date: string, time: string, id: string) => {
  router.push({
    name: 'editTodo',
    params: { id },
    query: { date, time }
  })
}

const check = (item: object) => {
  console.log(item)
}

// ionic 生命週期
onIonViewWillEnter(() => {
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

.item_dot {
  margin: 0 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #000;
}
.item_bar {
  margin: 0 4px;
  width: 4px;
  height: auto;
  background-color: #000;
}
</style>