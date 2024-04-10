<template>
    <form @submit.prevent="submitForm">
        <div class="mb-6">
            <label for="input-email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
            <div class="relative mb-6">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
                    </svg>
                </div>
                <input type="email" id="input-email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                                            focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  
                                                            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                                                            dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            v-model="email"
                                                            placeholder="name@monsite.com">
            </div>
        </div> 
        <div class="mb-6">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input type="password" id="password" v-model="password"
                        :class="{'bg-red-50 border-red-500': !noPassword, 'bg-gray-50 border-gray-300': noPassword}"
                        class="border text-gray-900 text-sm rounded-lg 
                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                        dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="•••••••••" required />
        </div> 
        <div class="flex items-start mb-6">
            <div class="flex items-center h-5">
            <input id="remember-me" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"/>
            </div>
            <label for="remember-me" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">remember me.</label>
        </div>
        <div class="flex items-start mb-6">
            <div class="flex items-center h-5">
            <input id="consent-cgu" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"/>
            </div>
            <label for="consent-cgu" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">consent cgu.</label>
        </div>
        <p>10000000-ffff-ffff-ffff-000000000001 sitekey hcaptcha dev</p>
        <div id="captcha-1" class="h-captcha" data-sitekey="" data-theme="dark"></div> 
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
    </form>
</template>

<script setup>
    import { useAuthStore } from '@/store/auth'

    useHead({
      script: [
        { src: 'https://js.hcaptcha.com/1/api.js?hl=fr', async: true, defer: true }
      ],
    })
    // Clé du site : 10000000-ffff-ffff-ffff-000000000001
    // Clé secrète : 0x0000000000000000000000000000000000000000
    onMounted(() => {
        var captcha1 = hcaptcha.render('captcha-1', { sitekey: '10000000-ffff-ffff-ffff-000000000001' })
    })
    const email = ref('')
    const password = ref('')
    const noPassword = false
    const noEmail = false
    
    const authStore = useAuthStore()
    
    function submitForm(){
        var response = hcaptcha.getResponse()
        if (password.value != null && email.value != null){
            console.log( authStore.logIn(email.value, password.value, response))
            //authStore.logIn(email.value, password.value).then(result => {console.log(result) })
            //console.log( authStore.getProfile())
        } else {
            console.log('quoiquoiAh!')
            noPassword = password.value == null
            noEmail = email.value == null
        }
    }
</script>