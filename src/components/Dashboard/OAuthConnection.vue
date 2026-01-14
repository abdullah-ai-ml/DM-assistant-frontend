<script setup>
import { onMounted, ref } from "vue";
import { useConnectionStore } from "@/stores/connections";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

const route = useRoute()
const store = useConnectionStore();

let {handleConnection} = store;

let { connections } = storeToRefs(store);

onMounted(() => {
    const google_status = route.query.google_ads;

    const google_connection = localStorage.getItem('google_connection')

    if (google_status && google_status === "connected") {
        localStorage.setItem("google_connection", google_status)
        connections.value.forEach(conn => {
            if (conn.provider === 'google') {
                conn.status = 'connected';
            }
        });
        
    }
    else if(!google_connection){
        connections.value.forEach(conn => {
            if (conn.provider === 'google') {
                conn.status = 'connected';
            }
        });
    }
});





const handleConnect = async (connection) => {
    try {
        await handleConnection(connection);
    } catch (err) {
        console.error("Failed to trigger OAuth:", err);
    }
};
</script>

<template>
  <div class="shadow-card border rounded-xl bg-card">
    <!-- Header -->
    <div class="p-4 border-b">
      <div class="flex items-center space-x-2">
        <span class="text-lg">🔗</span>
        <h2 class="text-lg font-semibold">Platform Connections</h2>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-4">
      <div
        v-for="connection in connections"
        :key="connection.name"
        class="flex items-center justify-between p-4 rounded-lg border border-border bg-gradient-card"
      >
        <div class="flex items-center space-x-4">
          <!-- Status Icon -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            :class="
              connection.status === 'connected'
                ? 'bg-accent/10 text-accent'
                : 'bg-muted text-muted-foreground'
            "
          >
            {{ connection.status === "connected" ? "✔️" : "⚠️" }}
          </div>

          <!-- meta  -->
          <div>
            <h3 class="font-medium">{{ connection.name }}</h3>
            <p class="text-sm text-muted-foreground">
              {{ connection.description }}
            </p>
            <p class="text-xs text-muted-foreground">
              Last sync: {{ connection.lastSync }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <!-- Status Badge -->
          <span
            class="px-2 py-1 text-xs rounded capitalize"
            :class="
              connection.status === 'connected'
                ? 'bg-accent text-accent-foreground'
                : 'bg-secondary text-secondary-foreground'
            "
          >
            {{ connection.status }}
          </span>

          <!-- Action Button -->
          <button
            class="px-3 py-1.5 rounded-md text-sm cursor-pointer border "
            :class="
              connection.status === 'connected'
                ? 'border border-border bg-transparent'
                : 'bg-primary text-primary-foreground'
            "
            @click="handleConnect(connection)"
          >
            {{ connection.status === "connected" ? "Reconnect" : "Connect" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
