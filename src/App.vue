<template>
  <v-responsive>
    <v-app :theme="theme">
      <v-app-bar :elevation="2" density="compact">
        <v-app-bar-title>Vibration Tool</v-app-bar-title>
        <v-spacer />
        <v-btn icon>
          <v-icon icon="mdi-dots-vertical" />
          <v-menu activator="parent">
            <v-list>
              <v-divider />
              <v-list-item title="設定" prepend-icon="mdi-cog">
                <ConfigView />
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
      </v-app-bar>
      <v-main>
        <MainView />
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script lang="ts" setup>
import ConfigView from "./components/ConfigView.vue";
import MainView from "./components/MainView.vue";
import { useBackup } from "./composables/Backup";
import { useTheme } from "./composables/Theme";

const {createBackup, loadBackups} = 
useBackup();
const { loadTheme, theme } = useTheme();
loadTheme();
loadBackups();
createBackup();
</script>
