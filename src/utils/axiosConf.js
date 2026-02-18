import axios from 'axios';

function getAccessToken() {
    return localStorage.getItem("token") ?? "";
}

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    timeout: 10000,
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

    
    if (
      status === 401 &&
      (
       data.message = "TOKEN_HAS_EXPIRED"
      )
    ) {
      
      localStorage.removeItem("token")
      localStorage.removeItem("google_connection")

      pinia._s.clear()

      router.replace("/login")

      return Promise.reject(new axios.Cancel("Token expired"))
    }

    // Pass other errors through
    return Promise.reject(error)
  }
)

export default apiClient;
