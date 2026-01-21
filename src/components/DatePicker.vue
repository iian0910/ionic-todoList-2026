<template>
  <div class="picker-wrapper">
    <div class="dates-container" ref="datesContainer">
      <div 
        v-for="date in dates" 
        :key="date.timestamp"
        :class="['date-item', { 
          'selected': isSelected(date), 
          'today': isToday(date) 
        }]"
        @click="selectDate(date)"
      >
        <div class="weekday">{{ date.weekday }}</div>
        <div class="day">{{ date.day }}</div>
        <div class="month">{{ date.month }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import dayjs from "dayjs"

  // interface
  interface DateItem {
    date: Date;
    day: number;
    month: string;
    weekday: string;
    timestamp: number;
  }

  // emit
  const emit = defineEmits(['selectedDate'])

  // data
  const datesContainer = ref<HTMLElement|null>(null);
  const selectedDate = ref<Date>(new Date());
  const dates = ref<DateItem[]>([]);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  // methods
  const generateDates = () => {
    const result = [];
    const today = new Date();
    
    for (let i = -15; i <= 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      result.push({
        date: new Date(date),
        day: date.getDate(),
        month: months[date.getMonth()],
        weekday: weekdays[date.getDay()],
        timestamp: date.getTime()
      });
    }

    dates.value = result;
  };

  const selectDate = (date: DateItem) => {
    selectedDate.value = new Date(date.date);
    emit('selectedDate', dayjs(selectedDate.value).format("YYYY/MM/DD"))
  };

  const isSelected = (date: DateItem) => {
    return date.date.toDateString() === selectedDate.value.toDateString();
  };

  const isToday = (date: DateItem) => {
    const today = new Date();
    return date.date.toDateString() === today.toDateString();
  };

  // mounted
  onMounted(() => {
    generateDates();
    setTimeout(() => {
      if (datesContainer.value) {
        const selectedElement = datesContainer.value.querySelector('.selected');
        if (selectedElement) {
          selectedElement.scrollIntoView({ 
            behavior: 'smooth', 
            inline: 'center',
            block: 'nearest'
          });
        }
      }
    }, 100);
  })
</script>

<style lang="scss" scoped>

.date-picker-container {
  background: white;
  border-radius: 20px;
  padding: 30px 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
}

.selected-date {
  color: #667eea;
  font-size: 18px;
  font-weight: 500;
}

.picker-wrapper {
  position: relative;
  overflow: hidden;
  padding: 0 6px;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  background: #667eea;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.nav-button:hover {
  background: #764ba2;
  transform: translateY(-50%) scale(1.1);
}

.nav-button:active {
  transform: translateY(-50%) scale(0.95);
}

.nav-button.prev {
  left: 5px;
}

.nav-button.next {
  right: 5px;
}

.dates-container {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 10px 0;
}

.dates-container::-webkit-scrollbar {
  display: none;
}

.date-item {
  color: #333;
  min-width: 70px;
  height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  flex-shrink: 0;
}

.date-item:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
}

.date-item.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.date-item.today {
  border-color: #ffa726;
  border-width: 3px;
}

.weekday {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 5px;
  opacity: 0.8;
}

.day {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 3px;
}

.month {
  font-size: 11px;
  opacity: 0.7;
}

.date-item.selected .weekday,
.date-item.selected .month {
  opacity: 1;
}
</style>