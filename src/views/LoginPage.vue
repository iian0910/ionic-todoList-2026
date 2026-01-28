<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="center-container">
        <ion-title size="large" class="ion-text-center login-title">
          Sign In
        </ion-title>
        <div class="ion-padding-vertical">
          <ion-input
            class="ion-margin-bottom"
            fill="outline"
            placeholder="mail@mail.com"/>
          <ion-input
            class="ion-margin-bottom"
            fill="outline"
            placeholder="********"/>
          <button type="button" class="login-button">登入</button>
          <div class="ion-text-center login-hint">Don't have an account? <span>Sign Up</span></div>
        </div>
        <div class="divider"></div>
        <div class="ion-text-center login-other-way-hint">Or sign in with:</div>
        <div class="ion-text-center">
          <button type="button" class="login-google-button" @click="openGoogleLogin">
            <ion-icon aria-hidden="true" color="danger" :icon="logoGoogle"/>
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonTitle,
  IonInput,
  IonIcon
} from '@ionic/vue';
import { ref } from 'vue';
import { auth, googleProvider } from '../js/firebaseDB';
import { signInWithPopup } from 'firebase/auth';
import { UserInfo } from '@/js/interface'
import { useRouter } from 'vue-router';
import { openToast } from '@/composible/util';
import { useUserStore } from '@/store';
import { logoGoogle } from 'ionicons/icons';

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
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login-title {
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 64px;
}
.login-button {
  margin-top: 48px;
  width: 100%;
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
  background-color: #6366f1;
}
.login-hint {
  margin-top: 8px;
  color: #5f5f5f;
  span {
    color: #f59e0b;
    font-weight: bold;
  }
}
.divider {
  margin-top: 64px;
  margin-bottom: 24px;
  width: 100%;
  height: 1px;
  background-color: #5f5f5f;
}
.login-other-way-hint {
  margin-bottom: 16px;
  color: #5f5f5f;
}
.login-google-button {
  width: 160px;
  height: 50px;
  padding: 5px;
  border-radius: 25px;
  background-color: transparent;
  border: 1px solid #ef4444;
}
</style>