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
import { useVibrationPattern, VIBRATION_PATTERN_LIST } from "../composables/VibrationPattern";
const { setPattern, start, stop, enableVibrationFeature, canStart, canStop, currentStatus, currentVibrationPattern, passed } = useVibrationPattern();

</script>
