import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useConnectionStore } from '@/stores/connections';
import { useGoogleAdsStore } from '@/stores/googleAds';
import { storeToRefs } from 'pinia';
import router from '@/router';

function getAccessToken() {
  return localStorage.getItem("token") ?? "";
}

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token dynamically on every request
apiClient.interceptors.request.use((config) => {

  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});



apiClient.interceptors.response.use(
  (response) => {

    return response
  },
  (error) => {

    if (!error.response) {
      return Promise.reject(error)
    }

    const { status, data } = error.response
    let authStore = useAuthStore()
    let connectionStore = useConnectionStore()
    let googleAdsStore = useGoogleAdsStore()

    if (status === 401 && (data.message === "TOKEN_HAS_EXPIRED")) {

      localStorage.removeItem("token")
      localStorage.removeItem("google_connection")

      authStore.$reset()
      connectionStore.$reset()
      googleAdsStore.$reset()

      router.replace("/login")

      return Promise.reject(new axios.Cancel("Token expired"))
    }
    if (status === 401 && data.error === "GOOGLE_AUTH_REQUIRED") {

      localStorage.setItem("google_connection", false);

      const { connections } = storeToRefs(connectionStore);
      connections.value.forEach(conn => {
        if (conn.provider === 'google') {
          conn.status = 'disconnected';
        }
      });

      // ✅ Resolve instead of reject
      return Promise.resolve({
        data: {
          ok: false,
          google_auth_required: true
        }
      });
    }


    // Pass other errors through
    return Promise.reject(error)
  }
)

export default apiClient;
