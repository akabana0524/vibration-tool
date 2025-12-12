import { computed, ref } from "vue";

export const VIBRATION_PATTERN_LIST = ['未選択', 'T1', 'T2', 'T3'] as const;
export type VIBRATION_PATTERN = typeof VIBRATION_PATTERN_LIST[number];
export const VIBRATION_STATUS_LIST = ['停止', '振動中'] as const;
export type VIBRATION_STATUS = typeof VIBRATION_STATUS_LIST[number];

const PROCESS_INTERVAL = 50;

export function useVibrationPattern() {
    const beginTimestamp = ref(0);
    const currentTimestamp = ref(0);
    const loopInterval = ref(0);
    const currentVibrationPattern = ref('');
    const passed = computed(() => currentTimestamp.value - beginTimestamp.value);
    const currentStatus = computed(computeCurrentStatus);
    const canStart = computed(() => currentVibrationPattern.value != '未選択' && beginTimestamp.value == 0);
    const canStop = computed(() => loopInterval.value != 0);
    function setPattern(pattern: VIBRATION_PATTERN) {
        currentVibrationPattern.value = pattern;
    }

    function start() {
        if (canStart.value) {
            const now = new Date().getTime();
            currentTimestamp.value = now;
            beginTimestamp.value = now;
            loopInterval.value = window.setInterval(process, PROCESS_INTERVAL);
        }
    }
    function stop() {
        if (canStop.value) {
            clearInterval(loopInterval.value);
            loopInterval.value = 0;
            beginTimestamp.value = 0;
            currentTimestamp.value = 0;
        }
    }
    function process() {
        currentTimestamp.value = new Date().getTime();
        switch (currentStatus.value) {
            case '停止': break;
            case '振動中':
                navigator.vibrate(50);
        }
    }
    function computeCurrentStatus(): VIBRATION_STATUS {
        return passed.value % 2000 < 1000 ? '停止' : '振動中';
    }
    return {
        setPattern,
        start,
        stop,
        canStart,
        canStop,
        beginTimestamp,
        currentVibrationPattern,
        currentStatus,
        passed
    }
}