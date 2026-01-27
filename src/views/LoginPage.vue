<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="center-container ion-display-flex ion-justify-content-center ion-align-items-center">
        <ion-button
          @click="openGoogleLogin"
          color="danger"
          size="large"
        >
          GOOGLE 登入
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonButton
} from '@ionic/vue';
import { ref } from 'vue';
import { auth, googleProvider } from '../js/firebaseDB';
import { signInWithPopup } from 'firebase/auth';
import { UserInfo } from '@/js/interface'
import { useRouter } from 'vue-router';
import { openToast } from '@/composible/util';
import { useUserStore } from '@/store';

const router = useRouter()
const store = useUserStore()

// data
const user = ref<UserInfo | null>(null)

// methods
const openGoogleLogin = async() => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    console.log('result =>', result)

    user.value = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL
    }

    store.saveUserInfo(user.value)
    openToast('成功登入', 'success')

    router.push({name: 'home'})
  } catch (err: any) {
    // 錯誤處理
    if (err.code === 'auth/popup-closed-by-user') {
      openToast('登入已取消', 'danger')
    } else if (err.code === 'auth/popup-blocked') {
      openToast('彈出視窗被封鎖，請允許彈出視窗', 'danger')
    } else {
      openToast('登入失敗，請稍後再試', 'danger')
    }
  }
  
}
</script>

<style lang="scss" scoped>
.center-container {
  height: 100%;
}
</style>