<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from './stores/auth.store';

export default defineComponent({
  name: 'App',
  
  setup() {
    const authStore = useAuthStore();
    
    // Restaurar sesión al cargar la app
    authStore.restoreSession();
    
    return {};
  },
});
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

#app {
  min-height: 100vh;
  width: 100%;
}
</style>
