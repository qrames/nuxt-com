import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { locally } from '@/utils/locally'

//import Swal from 'sweetalert2'
//import { apiRest } from '@/server/api'



export const useUserStore = defineStore('cart', () => {
  const token = ref('')
  const user = ref()

  const Authenticated = computed(() =>  token.value != ''  && token.value != undefined)

  function initUser(){
    token.value = locally.getItem('token') || ''
  }

  function setToken(new_token: string){
    //apiRest.defaults.headers.common["Authorization"] = new_token != ''  && new_token != undefined ? "Token " + new_token : ''
    token.value = new_token != undefined ? new_token : ''
    locally.setItem('token', token.value)
  }
  return {
    initUser,
    setToken,
  }
})
