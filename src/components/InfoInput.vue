<template>
  <div class="ion-padding">
    <div class="ion-margin-bottom">
      <div class="input_title">日期</div>
      <ion-input
        :value="todo.date"
        @update:modelValue="todo.date = $event"
        label-placement="floating"
        fill="outline"
        readonly
        @click="openDateModal"
      />
      <ion-modal
        :is-open="isDateModalOpen"
        :initial-breakpoint="0.5"
        handle-behavior="cycle"
        @ionModalDidDismiss="closeDateModal"
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
        readonly
        @click="openTimeModal"
      />
      
      <ion-modal
        :is-open="isTimeModalOpen"
        :initial-breakpoint="0.3"
        handle-behavior="cycle"
        @ionModalDidDismiss="closeTimeModal"
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
        <ion-button fill="solid" @click="handelEvent">
          {{ editMode ? '更新' : '新增' }}
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </div>
</template>
<script setup lang="ts">
import {
  IonContent,
  IonInput,
  IonDatetime,
  IonModal,
  IonToolbar,
  IonButtons,
  IonButton
} from '@ionic/vue';
import { computed, ref, watch } from 'vue';
import dayjs from "dayjs"
import { TodoItem } from '@/js/interface';

// props
const props = defineProps<{editTodo: TodoItem}>()

// emit
const emit = defineEmits(['addTodo', 'updateTodo'])

// data
const dateISO = ref<string>('')
const timeISO = ref<string>('')

const isDateModalOpen = ref(false)
const isTimeModalOpen = ref(false)

const todo = ref<TodoItem>({
  id: '',
  date: '',
  time: '',
  content: '',
  check: false
})

// computed
const editMode = computed(() => props.editTodo?.id !== '')

// watch
watch(
  () => props.editTodo,
  (newVal) => {
    if (editMode.value) {
      todo.value = {
        id: newVal?.id,
        date: newVal.date,
        time: newVal.time,
        content: newVal.content,
        check: newVal.check,
        iso8601: newVal.iso8601,
      }

      // 更新 ISO 格式供 datetime 使用
      if (newVal.date) {
        dateISO.value = dayjs(newVal.date).format()
      }
      if (newVal.time) {
        // 組合日期和時間
        const dateTimeString = `${newVal.date} ${newVal.time}`
        timeISO.value = dayjs(dateTimeString).format()
      }
    }
  },
  {
    deep: true,
    immediate: true  // 立即執行
  }
)


// methods
const openDateModal = () => {
  if (dateISO.value) {
    dateISO.value = dayjs(dateISO.value).format()
  } else {
    dateISO.value = dayjs(new Date()).format()
  }

  todo.value.iso8601 = dateISO.value
  todo.value.date = dayjs(dateISO.value).format('YYYY-MM-DD')

  isDateModalOpen.value = true
}

const closeDateModal = () => {
  isDateModalOpen.value = false
  
  if (dateISO.value) {
    dateISO.value = dayjs(dateISO.value).format()
  } else {
    dateISO.value = dayjs(new Date()).format()
  }
}

const openTimeModal = () => {
  if (timeISO.value) {
    timeISO.value = dayjs(timeISO.value).format()
  } else {
    timeISO.value = dayjs(new Date()).format()
  }

  todo.value.iso8601 = timeISO.value
  todo.value.time = dayjs(timeISO.value).format('HH:mm')

  isTimeModalOpen.value = true
}

const closeTimeModal = () => {
  isTimeModalOpen.value = false

  if (timeISO.value) {
    timeISO.value = dayjs(timeISO.value).format()
  } else {
    timeISO.value = dayjs(new Date()).format()
  }
}

const onDateChange = (e: CustomEvent) => {
  const iso = e.detail.value
  if (!iso) return

  dateISO.value = dayjs(iso).format() // 給 ion-datetime
  todo.value.iso8601 = dateISO.value
  todo.value.date = dayjs(iso).format('YYYY-MM-DD') // 給自己
}

const onTimeChange = (e: CustomEvent) => {
  const iso = e.detail.value
  if (!iso) return

  timeISO.value = dayjs(iso).format() // 給 ion-datetime
  todo.value.iso8601 = timeISO.value
  todo.value.time = dayjs(iso).format('HH:mm') // 給自己
}

const addTodo = () => {
  emit('addTodo', todo.value)

  todo.value = {
    id: '',
    date: '',
    time: '',
    content: '',
    check: false
  }
}

const updateTodo = () => {
  emit('updateTodo', todo.value)
}

const handelEvent = () => {
  if (editMode.value) {
    updateTodo()
  } else {
    addTodo()
  }
}
</script>

<style lang="scss" scoped>
.input_title {
  font-size: 18px;
}
</style>
