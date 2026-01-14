<script>
import { onMounted } from 'vue';
import apiClient from '@/utils/axiosConf';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useGoogleAdsStore } from '@/stores/googleAds';
import { storeToRefs } from 'pinia';
onMounted(()=>{
    const googleAdsStore = useGoogleAdsStore()
    const {customer_list, provider} = storeToRefs(googleAdsStore);

    headers = {
        Authorization: `Bearer ${token}`
    }
    const response = apiClient.get(`/${provider.value}/list_customers`);
    if(!response.ok){
        alert("Fething the customer list went wrong")
    }
    customer_list.value = response.data.customer_list

})
</script>