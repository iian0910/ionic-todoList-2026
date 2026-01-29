<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="ion-toolbar">
        <div class="ion-display-flex ion-justify-content-between ion-align-items-center">
          <ion-buttons slot="start">
            <ion-title class="ion-padding-horizontal">TODOLIST</ion-title>
          </ion-buttons>
          <div class="ion-display-flex ion-align-items-center ion-padding-horizontal">
            <ion-buttons slot="end" class="icon_area">
              <ion-icon class="icon_area_img" aria-hidden="true" size="large" :icon="personCircleOutline" v-if="!user?.uid"/>
              <ion-avatar v-else>
                <img 
                  :src="user?.photoURL" 
                  alt="用戶頭像"
                  referrerpolicy="no-referrer"
                >
              </ion-avatar>
            </ion-buttons>
          </div>
        </div>
      </ion-toolbar>
      <date-picker
        v-if="user?.uid"
        @selected-date="getDBInfo"
      />
    </ion-header>
    <ion-content :fullscreen="true" class="page-content">
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
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonAvatar,
  onIonViewWillEnter
} from '@ionic/vue';
import { checkmarkCircleOutline, checkmarkOutline, create, fileTrayFullOutline, personCircleOutline, trashOutline } from 'ionicons/icons';
import dayjs from "dayjs"
import { ref } from 'vue';
import { db, auth } from '../js/firebaseDB';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import DatePicker from '@/components/DatePicker.vue';
import { TodoItem, UserInfo } from '@/js/interface'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import { useRouter } from 'vue-router';
import { openToast } from '@/composible/util';
import { useUserStore } from '@/store';

const router = useRouter()
const store = useUserStore()

// data
const todos = ref<TodoItem[]>([])
const user = ref<UserInfo | null>(null)

// methods
const getDBInfo = async(dateStr: string) => {
  const dateKey = dayjs(dateStr).format("YYYY-MM-DD")
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

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

  getDBInfo(item.date)
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

  getDBInfo(item.date)
}

const waitForAuth = (): Promise<UserInfo | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();  // 立即取消監聽
      resolve(user);
    });
  })
}

// ionic 生命週期
onIonViewWillEnter(async() => {
  const userInfo = await waitForAuth()
  user.value = {
    uid: userInfo?.uid,
    email: userInfo?.email,
    displayName: userInfo?.displayName,
    photoURL: userInfo?.photoURL
  }
    
  store.saveUserInfo(user.value)

  if (userInfo) {
    getDBInfo(dayjs(new Date()).format("YYYY-MM-DD"))
  } else {
    openToast('使用者未登入', 'danger')
  }
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
ion-avatar {
  width: 48px;
  height: 48px;
}
</style>