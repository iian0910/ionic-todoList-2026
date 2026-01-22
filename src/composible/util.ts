import { toastController } from "@ionic/vue"

export const openToast = async(msg: string, status: string) => {
  const toast = await toastController.create({
    message: msg,
    duration: 300,
    position: 'top',
    color: status
  })

  await toast.present()
}