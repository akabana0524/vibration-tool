<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col v-for="pattern in VIBRATION_PATTERN_LIST" :key="pattern">
            <v-btn
              @click="() => setPattern(pattern)"
              :active="currentVibrationPattern == pattern"
              :disabled="passed > 0"
              active-color="primary"
              >{{ pattern }}</v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-slider
              :model-value="currentTotal"
              :max="MAX_TOTAL"
              step="60000"
              @update:model-value="setTotal"
              label="トータル駆動時間"
              :disabled="passed > 0"
            ></v-slider>
          </v-col>
          <v-col cols="auto">
            {{ totalFormatString }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-slider
              :model-value="currentDelay"
              :max="MAX_DELAY"
              step="60000"
              @update:model-value="setDelay"
              label="振動終了切上"
              :disabled="passed > 0"
            ></v-slider>
          </v-col>
          <v-col cols="auto">
            {{ delayFormatString }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-slider
              :model-value="currentCutoff"
              :max="MAX_CUTOFF"
              step="60000"
              @update:model-value="setCutoff"
              label="振動開始遅延"
              :disabled="passed > 0"
              reverse
            ></v-slider>
          </v-col>
          <v-col cols="auto">
            {{ cutoffFormatString }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn :disabled="!canStart" @click="start" :active="passed > 0" active-color="primary"
              >Start</v-btn
            >
          </v-col>
          <v-col>
            <v-btn :disabled="!canStop" @click="stop">Stop</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <div>振動機能利用可否:{{ enableVibrationFeature }}</div>
      <div>経過時間:{{ passedFormatString }}</div>
      <div>現在の振動ステータス:{{ currentStatus }}</div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useVibrationPattern, VIBRATION_PATTERN_LIST } from '../composables/VibrationPattern';
import humonizeDuration from 'humanize-duration';

const MAX_DELAY = 1000 * 60 * 60;
const MAX_TOTAL = 1000 * 60 * 60 * 12;
const MAX_CUTOFF = 1000 * 60 * 60;

const {
  setPattern,
  start,
  stop,
  setDelay,
  setTotal,
  setCutoff,
  enableVibrationFeature,
  canStart,
  canStop,
  currentStatus,
  currentVibrationPattern,
  currentDelay,
  currentTotal,
  currentCutoff,
  passed,
} = useVibrationPattern();
const delayFormatString = computed(() => humonizeDuration(currentDelay.value, { language: 'ja' }));
const totalFormatString = computed(() => humonizeDuration(currentTotal.value, { language: 'ja' }));
const cutoffFormatString = computed(() =>
  humonizeDuration(currentCutoff.value, { language: 'ja' })
);
const passedFormatString = computed(() =>
  humonizeDuration(passed.value, { units: ['h', 'm', 's', 'ms'], language: 'ja' })
);
</script>
