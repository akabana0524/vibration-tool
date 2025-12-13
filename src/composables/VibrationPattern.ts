import { computed, ref, watch } from 'vue'

export const VIBRATION_PATTERN_LIST = ['未選択', 'T1', 'T2', 'T3'] as const
export type VIBRATION_PATTERN = (typeof VIBRATION_PATTERN_LIST)[number]
export const VIBRATION_STATUS_LIST = ['停止', '振動中'] as const
export type VIBRATION_STATUS = (typeof VIBRATION_STATUS_LIST)[number]

const PROCESS_INTERVAL = 50
const DELAY_DEFAULT = 17 * 60 * 1000 // 17分
const CUTOFF_DEFAULT = 17 * 60 * 1000 // 17分
const TOTAL_DEFAULT = 8.5 * 60 * 60 * 1000 // 8時間30分
const VIBRATION_PERIOD = 5000 // 5秒間振動を続ける
const VIBRATION_INTERVAL = 1000 // 1秒周期で繰り返す
const VIBRATION_DURATION = 800 // 800ms 振動する

export function useVibrationPattern() {
  const beginTimestamp = ref(0)
  const currentTimestamp = ref(0)
  const processIntervalInstance = ref(0)
  const vibrationIntervalInstance = ref(0)
  const total = ref(TOTAL_DEFAULT)
  const delay = ref(DELAY_DEFAULT)
  const cutoff = ref(CUTOFF_DEFAULT)
  const pattern = ref<VIBRATION_PATTERN>('未選択')
  const status = ref<VIBRATION_STATUS>('停止')

  const enableVibrationFeature = computed(() => !!navigator.vibrate)
  const currentDelay = computed(() => delay.value)
  const currentTotal = computed(() => total.value)
  const currentCutoff = computed(() => cutoff.value)
  const currentStatus = computed(() => status.value)
  const currentVibrationPattern = computed(() => pattern.value)
  const canStart = computed(
    () => currentVibrationPattern.value != '未選択' && beginTimestamp.value == 0,
  )
  const canStop = computed(() => processIntervalInstance.value != 0)
  const passed = computed(() => currentTimestamp.value - beginTimestamp.value)

  watch(status, (v, old) => {
    if (v != old) {
      switch (v) {
        case '停止':
          clearInterval(vibrationIntervalInstance.value)
          vibrationIntervalInstance.value = 0
          break
        case '振動中':
          navigator.vibrate(VIBRATION_DURATION)
          vibrationIntervalInstance.value = window.setInterval(() => {
            navigator.vibrate(VIBRATION_DURATION)
          }, VIBRATION_INTERVAL)
          break
      }
    }
  })

  function setPattern(_pattern: VIBRATION_PATTERN) {
    pattern.value = _pattern
  }
  function setDelay(_delay: number) {
    delay.value = _delay
  }
  function setTotal(_total: number) {
    total.value = _total
  }
  function setCutoff(_cutoff: number) {
    cutoff.value = _cutoff
  }

  function start() {
    if (canStart.value) {
      const now = new Date().getTime()
      currentTimestamp.value = now
      beginTimestamp.value = now
      processIntervalInstance.value = window.setInterval(process, PROCESS_INTERVAL)
    }
  }
  function stop() {
    if (canStop.value) {
      clearInterval(processIntervalInstance.value)
      status.value = '停止'
      processIntervalInstance.value = 0
      beginTimestamp.value = 0
      currentTimestamp.value = 0
    }
  }
  function computeVibrationStatus(): VIBRATION_STATUS {
    switch (currentVibrationPattern.value) {
      case 'T1':
        return passed.value % 10000 < VIBRATION_PERIOD ? '振動中' : '停止'
      case 'T2':
        return passed.value % 20000 < VIBRATION_PERIOD ? '振動中' : '停止'
      case 'T3':
        return passed.value % 30000 < VIBRATION_PERIOD ? '振動中' : '停止'
      default:
        return '停止'
    }
  }
  function process() {
    currentTimestamp.value = new Date().getTime()
    // 開始遅延より手前
    if (passed.value <= delay.value) {
      return
    }
    // 終了切上より後
    if (passed.value >= total.value - cutoff.value) {
      return
    }
    const computedStatus = computeVibrationStatus()
    if (computedStatus != status.value) {
      status.value = computedStatus
    }
  }

  return {
    setPattern,
    start,
    stop,
    setDelay,
    setTotal,
    setCutoff,
    enableVibrationFeature,
    canStart,
    canStop,
    beginTimestamp,
    currentVibrationPattern,
    currentStatus,
    currentDelay,
    currentTotal,
    currentCutoff,
    passed,
  }
}
