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
                  class="user-photo"
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
        @selected-date="filterInfo"
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
import { ref } from 'vue';
import { db, auth } from '../js/firebaseDB';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import DatePicker from '@/components/DatePicker.vue';
import { TodoItem, UserInfo } from '@/js/interface'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import { useRouter } from 'vue-router';
import { openToast } from '@/composible/util';
import { useUserStore } from '@/store';
import dayjs from 'dayjs';

const router = useRouter()
const store = useUserStore()

// data
const todos = ref<TodoItem[]>([])
const user = ref<UserInfo | null>(null)

// methods
const getDBInfo = async() => {
  const userName = store.uid

  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }

  try {
    const querySnapshot = await getDocs(collection(db, "todoList", userName, "todos"));
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

  const q = query(
    collection(db, "todoList", userName, "todos"),
    where("id", "==", item.id)
  )

  try {
    const querySnapshot = await getDocs(q);
    await deleteDoc(doc(db, "todoList", userName, "todos", querySnapshot.docs[0].id))

    openToast('刪除成功', 'success')
  } catch (error) {
    openToast(error as string, 'danger')
  }

  getDBInfo()
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

  const q = query(
    collection(db, "todoList", userName, "todos"),
    where("id", "==", item.id)
  )
  
  try {
    const querySnapshot = await getDocs(q);
    const docRef = doc(db, "todoList", userName, "todos", querySnapshot.docs[0].id);
    await updateDoc(docRef, {
      check: true
    })

    openToast('更新成功', 'success')
  } catch (error) {
    openToast(error as string, 'danger')
  }

  getDBInfo()
}

const waitForAuth = (): Promise<UserInfo | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();  // 立即取消監聽
      resolve(user);
    });
  })
}

const filterInfo = async(filterDateKey: string) => {
  const userName = store.uid
  if (!userName) {
    openToast('請先登入', 'danger');
    return;
  }
  const q = query(
    collection(db, "todoList", userName, "todos"),
    where("date", "==", filterDateKey)
  )
  const querySnapshot = await getDocs(q);
  todos.value = querySnapshot.docs.map(doc => ({
    ...doc.data()
  } as TodoItem))
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
    getDBInfo()
    filterInfo(dayjs(new Date()).format('YYYY-MM-DD'))
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
ion-avatar {
  width: 48px;
  height: 48px;
}
.user-photo {
  width: 48px;
  height: 48px;
  display: block;
  margin: 0 auto;
}
</style>