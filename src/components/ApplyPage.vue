<template>
  <ion-title size="large" class="ion-text-center login-title">
    {{ props.pageTitle }}
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
    <button type="button" class="login-button">
      {{ createAccount ? '註冊' : '登入' }}
    </button>
    <div v-if="createAccount" class="ion-text-center login-hint">Have an account? <span @click="goToSingInPage">Sign In</span></div>
    <div v-else class="ion-text-center login-hint">Don't have an account? <span @click="goToSingUpPage">Sign Up</span></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()

// props
const props = defineProps({
  pageTitle: {
    type: String,
    default: ''
  }
})

// computed
const createAccount = computed(() => route.path.includes('sign-up'))


// methods
const goToSingUpPage = () => {
  router.push({name: 'signUp'})
}

const goToSingInPage = () => {
  router.push({name: 'login'})
}
</script>

<style lang="scss" scoped>

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
</style>