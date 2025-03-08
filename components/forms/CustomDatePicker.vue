<template>
  <div ref="datepickerWrapper">
    <FormsBaseInput
        :label="props.label"
        :placeholder="props.placeholder"
        :class="props.class"
        v-model="model"
        :id="props.id"
        @change="change"
        :disabled="props.disabled"
        :name="props.name"
        autocomplete="off"
        :errorMessageFromBackend="props.errorBackend"
    >
      <template #icon>
        <svg-icon type="mdi" class="text-asa-text-3 h-6 w-6" :path="mdiCalendarBlank"></svg-icon>
      </template>
    </FormsBaseInput>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';


const {locale} = useI18n();
const {getDateToday, isRtl} = useHelpers();
import DateConverter from "@/helpers/DateConverter";

interface PropsInterface {
  type?: string;
  label?: string | null;
  disabled?: boolean;
  icon?: string | null;
  placeholder?: string;
  name?: string;
  id?: string;
  class?: string;
  readonly?: boolean;
  showOnlyClock?: boolean
  showDefaultDate?: boolean
  minDate?: string
  errorBackend?: string
}

const emit = defineEmits(['onSelect']);

// Set default values for the props using withDefaults
const props = withDefaults(defineProps<PropsInterface>(), {
  type: 'text',
  label: null,
  disabled: false,
  readonly: false,
  icon: null,
  placeholder: '',
  name: '',
  class: '',
  id: '',
  showOnlyClock: false,
  showDefaultDate: false,
  minDate: '',
  errorBackend: ''
});

const model = defineModel();
const datepickerWrapper = ref<HTMLElement | null>(null);

function formatDate(timestamp: number): string {
  if (locale.value == 'fa') {
    const date = new persianDate(timestamp);
    return date.format('YYYY/MM/DD');
  } else {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    let day: string | number = date.getDate();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `${year}-${month}-${day}`;
  }
}

function formatTime(unixTimestamp: any) {
  let date = new Date(unixTimestamp);
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

var pd = null
onMounted(() => {
  if (props.showDefaultDate && !model.value) {
    if (isRtl.value) {
      model.value = DateConverter.convertDateFormat(getDateToday(), 'yyyy/MM/dd', 'jalali');
    } else {
      model.value = DateConverter.convertDateFormat(getDateToday(), 'yyyy-MM-dd', 'gregorian');
    }
  }

  pd = $(`#${props.id}`).pDatepicker({
    onlyTimePicker: props.showOnlyClock,
    observer: true,
    autoClose: true,
    initialValue: false,
    responsive: false,
    initialValueType: isRtl.value ? 'persian' : 'gregorian',
    calendarType: isRtl.value ? 'persian' : 'gregorian',
    secondPicker: false,
    navigator: {
      text: {
        btnNextText: '', // آیکون دلخواه,
        btnPrevText: '' // آیکون دلخواه
      }
    },
    toolbox: {
      todayButton: {
        text: {
          fa: "برو به امروز"
        }
      },
    },
    minDate: props.minDate ? props.minDate : '',
    format: props.showOnlyClock ? 'HH:mm' : locale.value == 'fa' ? 'YYYY/MM/DD' : 'YYYY-MM-DD',
    onSelect: function (unix: any) {
      const formattedDate = props.showOnlyClock ? formatTime(unix) : formatDate(unix)
      model.value = formattedDate;
      emit('onSelect', formattedDate);
    }
  });

  // Masking logic based on locale
  // @ts-ignore
  $(`#${props.id}`).mask(locale.value == 'fa' ? '0000/00/00' : '0000-00-00', {
    placeholder: props.placeholder ? props.placeholder : locale.value == 'fa' ? '____/__/__' : '____-__-__'
  });


});

watch(() => locale.value, () => {
  if (isRtl.value) {
    model.value = DateConverter.convertDateFormat(getDateToday(), 'yyyy/MM/dd', 'jalali');
  } else {
    model.value = DateConverter.convertDateFormat(getDateToday(), 'yyyy-MM-dd', 'gregorian');
  }
  pd = $(`#${props.id}`).pDatepicker({
    onlyTimePicker: props.showOnlyClock,
    observer: true,
    autoClose: true,
    initialValue: false,
    initialValueType: isRtl.value ? 'persian' : 'gregorian',
    calendarType: isRtl.value ? 'persian' : 'gregorian',
    secondPicker: false,
    navigator: {
      text: {
        btnNextText: '', // آیکون دلخواه,
        btnPrevText: '' // آیکون دلخواه
      }
    },
    toolbox: {
      todayButton: {
        text: {
          fa: "برو به امروز"
        }
      },
    },
    minDate: props.minDate ? props.minDate : '',
    format: props.showOnlyClock ? 'HH:mm' : locale.value == 'fa' ? 'YYYY/MM/DD' : 'YYYY-MM-DD',
    onSelect: function (unix: any) {
      const formattedDate = props.showOnlyClock ? formatTime(unix) : formatDate(unix)
      model.value = formattedDate;
      emit('onSelect', formattedDate);
    }
  });

  // Masking logic based on locale
  // @ts-ignore
  $(`#${props.id}`).mask(locale.value == 'fa' ? '0000/00/00' : '0000-00-00', {
    placeholder: props.placeholder ? props.placeholder : locale.value == 'fa' ? '____/__/__' : '____-__-__'
  });
})

let debounceTimer: any;


watch(model, () => {
  if (isValidDate(model.value)) {
    if (pd) {
      pd.setDate(new Date(DateConverter.convertDateFormat(model.value, 'yyyy-MM-dd')));
    }
  }
});

function isValidDate(dateString) {
  const regex = /^\d{4}\/\d{2}\/\d{2}$/;
  return regex.test(dateString);
}

function change(e: Event) {
  // Clear any existing debounce timer
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    // model.value = e.target?.value
    if (isValidDate(e.target?.value)) {
      pd.setDate(new Date(DateConverter.convertDateFormat(e.target?.value, 'yyyy-MM-dd')));
    }
    emit('onSelect', e.target?.value);
  }, 600); // Adjust debounce delay as needed
}
</script>

<style>
.datepicker-plot-area {
  font-family: "YekanBakh", sans-serif !important;
  @apply rounded-2xl p-4  bg-white w-[21rem]   !important;
  box-shadow: 0 0.5rem 1.25rem 0 #0000001A;

}

[dir=rtl] .datepicker-plot-area {
  font-family: "YekanBakh", sans-serif !important;
}

[dir=ltr] .datepicker-plot-area {
  font-family: sans-serif !important;
}

.datepicker-navigator {
  @apply flex items-center justify-between !important;
}

.pwt-btn-next, .pwt-btn-prev {
  @apply p-2 h-[2.5rem] w-[2.5rem] rounded-lg font-bold text-base  bg-[#2E99E51A] text-[#2E99E5]  flex items-center justify-center   !important;
}

.pwt-btn-switch {
  @apply rounded-full py-1 px-4 h-[2.5rem] w-[10.625rem]  border-[0.094rem] border-[#85858566] text-lg font-extrabold text-[#3B3B3B]  flex items-center justify-center   !important;

}

.second {
  display: none !important;
}

.second-divider {
  display: none !important;
}

.datepicker-state-only-time {
  width: 11.813rem !important;
}

.time-segment {
  width: 48% !important;
}

.datepicker-plot-area .datepicker-navigator .pwt-btn.pwt-btn-next {
  background-image: url('data:image/svg+xml,%3Csvg width=%278%27 height=%2714%27 viewBox=%270 0 8 14%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath id=%27Vector 22%27 d=%27M6.5 1.5L1.5 7L6.5 12.5%27 stroke=%27%232E99E5%27 stroke-width=%272%27/%3E%3C/svg%3E%0A') !important;
}

.datepicker-plot-area .datepicker-navigator .pwt-btn.pwt-btn-prev {
  background-image: url('data:image/svg+xml,%3Csvg width=%278%27 height=%2714%27 viewBox=%270 0 8 14%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M1.5 1.5L6.5 7L1.5 12.5%27 stroke=%27%232E99E5%27 stroke-width=%272%27/%3E%3C/svg%3E');
}

.datepicker-plot-area .datepicker-navigator .pwt-btn.pwt-btn-next, .datepicker-plot-area .datepicker-navigator .pwt-btn.pwt-btn-prev {
  background-position: center;
  background-repeat: no-repeat;
}

.datepicker-plot-area .datepicker-day-view .month-grid-box .header .header-row-cell {
  @apply flex items-center justify-center  text-base font-extrabold  text-[#595959] !important;
}

.datepicker-plot-area .datepicker-day-view .month-grid-box .header {
  display: block;
  width: 100%;
  float: left;
  padding-bottom: 1.25rem;
}

.datepicker-plot-area .datepicker-day-view .table-days td span {
  width: 2.5rem;
  height: 2.5rem;
  color: #595959;
  border-radius: 0.5rem;
  display: flex;
  border: 0.094rem solid transparent;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 400;
}

.datepicker-plot-area .datepicker-day-view .table-days td.selected span {
  background-color: #2E99E5;
  color: #fff;
  border: none;
  text-shadow: none;
  font-size: 1rem;
  font-weight: 700;
}


.datepicker-plot-area .table-days [data-date] .unavailable {
  color: #ced4d9;
}

.datepicker-plot-area .table-days [data-date] .holiday {
  color: #ef0e0e;
}

.datepicker-plot-area .datepicker-day-view .table-days td.today span {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.625rem;
  gap: 0.625rem;
  border-radius: 6.188rem;
  border: 0.125rem solid #85858566;
  color: #595959;
  background-color: transparent;
  font-size: 1rem;
  font-weight: 800;
}

.datepicker-plot-area .datepicker-day-view .table-days td.selected.today span {
  background-color: #2E99E5;
  color: #fff;
  text-shadow: none;
  border: 0.125rem solid transparent;
  font-size: 1rem;
  font-weight: 800;
}


.datepicker-plot-area .datepicker-day-view .table-days td span:hover {
  transition: .3s;
  border: 0.094rem solid #2E99E5;
  background-color: transparent;
  color: #595959;
  font-size: 1rem;
  font-weight: 400;
}

.datepicker-plot-area .datepicker-day-view .table-days td.today span:hover {
  transition: .3s;
  border: 0.125rem solid #2E99E5;
  background-color: transparent;
  color: #666666;
  font-size: 1rem;
  font-weight: 800;
}


.datepicker-plot-area .datepicker-day-view .table-days td span.other-month {
  background-color: "";
  color: #A6A6A6;
  border: 0.094rem solid transparent;
  text-shadow: none;
  font-size: 1rem;
  font-weight: 400;

}


.datepicker-plot-area .datepicker-day-view .table-days td span.other-month:hover {
  transition: .3s;
  border: 0.094rem solid #CCCCCC;
  background-color: transparent;
  color: #A6A6A6;
  font-size: 1rem;
  font-weight: 400;
}

.datepicker-plot-area .pwt-btn-calendar {
  display: none !important;
}

.datepicker-plot-area .toolbox {
  display: flex;
  justify-content: center;
  align-items: center;
}




</style>
