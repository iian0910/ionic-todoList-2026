<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="ion-toolbar">
        <ion-buttons slot="start" class="icon_area" @click="back">
          <ion-icon class="icon_area_img" aria-hidden="true" size="large" :icon="arrowBackOutline"/>
        </ion-buttons>
        <ion-title class="page_title">一周計畫</ion-title>
        <ion-buttons slot="end" class="icon_area"></ion-buttons>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true" class="page-content">
      <DynamicScroller 
        class="scroller"
        :items="weeklyTodo"
        :min-item-size="200"
        v-if="weeklyTodo.length"
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
                  <div class="ion-display-flex ion-align-items-center">
                    <ion-card-title>
                      {{ item.content }}
                    </ion-card-title>
                    <ion-icon class="pl-2" v-if="item.check" color="primary" :icon="checkmarkCircleOutline"></ion-icon>
                  </div>
                </ion-card-header>
    
                <ion-card-content class="ion-no-padding">
                  <div class="ion-display-flex ion-justify-content-between ion-align-items-center">
                    <div>
                      <ion-text>
                        {{ item.date }} {{ item.time }}
                      </ion-text>
                    </div>
                    <div class="ion-display-flex ion-justify-content-end">
                      <ion-icon v-if="!item.check" color="primary" :icon="create" @click="editTodo(item.date, item.id)"></ion-icon>
                      <ion-icon v-if="!item.check" color="success" :icon="checkmarkOutline" @click="check(item)"></ion-icon>
                      <ion-icon color="danger" :icon="trashOutline" @click="deleteTodo(item)"></ion-icon>
                    </div>
                  </div>
                </ion-card-content>
    
                
              </ion-card>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller >
      <div
        class="ion-display-flex ion-flex-column ion-justify-content-center ion-align-items-center no_data"
        v-else
      >
        <ion-icon :icon="fileTrayFullOutline" class="empty_status"></ion-icon>
        <div class="empty_title">目前尚無資料...</div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { db } from '@/js/firebaseDB';
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
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { arrowBackOutline, checkmarkCircleOutline, checkmarkOutline, create, fileTrayFullOutline, trashOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { openToast } from '@/composible/util';
import { TodoItem } from '@/js/interface';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'

const store = useUserStore()
const router = useRouter()

// data
const weeklyKey = ref<string[]>([])
const weeklyTodo = ref<TodoItem[]>([])

// methods
const getWeeklyDates = (startDate: Date) => {
  return Array.from({length: 7}, (_, i) => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

const getWeeklyTodo = async (weeklyKey: string[]) => {
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

  for(const date of weeklyKey) {
    const snap = await getDocs(
      collection(db, "todoList", userName, date)
    )

    snap.forEach(doc => {
      weeklyTodo.value.push({
        id: doc.data().id,
        date: doc.data().date,
        time: doc.data().time,
        content: doc.data().content, 
        check: doc.data().check
      })
    })
  }

  console.log('result =>', weeklyTodo.value)
}

const deleteTodo = async(item: TodoItem) => {
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

  try {
    await deleteDoc(doc(db, "todoList", userName, item.date, item.id))

    openToast('刪除成功', 'success')
  } catch (error) {
    openToast(error as string, 'danger')
  }

  getWeeklyTodo(weeklyKey.value)
}

const editTodo = (date: string, id: string) => {
  router.push({
    name: 'editTodo',
    params: { id },
    query: { date }
  })
}

const check = async(item: TodoItem) => {
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

  const docRef = doc(db, "todoList", userName, item.date, item.id);

  try {
    await updateDoc(docRef, {
      check: true
    })

    openToast('更新成功', 'success')
  } catch (error) {
    openToast(error as string, 'danger')
  }

  getWeeklyTodo(weeklyKey.value)
}

const back = () => {
  router.push({name: 'home'})
}

// 
onIonViewWillEnter(() => {
  weeklyKey.value = getWeeklyDates(new Date())
  getWeeklyTodo(weeklyKey.value)
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
.card-wrapper {
  padding: 2px 0; /* 上下間距 */
}
.no_data {
  height: 100%;
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
