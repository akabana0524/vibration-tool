<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col v-for="pattern in VIBRATION_PATTERN_LIST" :key="pattern">
            <v-btn @click="() => setPattern(pattern)" :active="currentVibrationPattern == pattern">{{ pattern }}</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-slider :model-value="currentDelay" :max="MAX_DELAY" step="60000" @update:model-value="setDelay" label="開始遅延"></v-slider>
          </v-col>
          <v-col>
            {{ delayFormatString }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn :disabled="!canStart" @click="start">Start</v-btn>
          </v-col>
          <v-col>
            <v-btn :disabled="!canStop" @click="stop">Stop</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <div>
        振動機能利用可否:{{ enableVibrationFeature }}
      </div>
      <div>
        経過時間:{{ passed }}
      </div>
      <div>
        現在の振動ステータス:{{ currentStatus }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useVibrationPattern, VIBRATION_PATTERN_LIST } from "../composables/VibrationPattern";
import humonizeDuration from 'humanize-duration';

const MAX_DELAY = 1000 * 60 * 60;

const { setPattern, start, stop, setDelay, enableVibrationFeature, canStart, canStop, currentStatus, currentVibrationPattern, currentDelay, passed } = useVibrationPattern();
const delayFormatString = computed(() => humonizeDuration( currentDelay.value, {language: 'ja'}));

</script>
