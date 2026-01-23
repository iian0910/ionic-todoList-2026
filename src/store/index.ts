import { defineStore } from "pinia"

interface UserInfo {
  uid: string | null | undefined,
  email: string | null | undefined,
  displayName: string | null | undefined,
  photoURL: string | null | undefined
}

export const useUserStore = defineStore('user', {
  state: (): UserInfo => {
    return {
      uid: '',
      email: '',
      displayName: '',
      photoURL: ''
    }
  },
  actions: {
    saveUserInfo(info: UserInfo) {
      this.uid = info.uid,
      this.email = info.email,
      this.displayName = info.displayName,
      this.photoURL = info.photoURL
    }
  },
  persist: true
})