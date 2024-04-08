import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


export const useAuthStore = defineStore('auth', () => {
  const BaseURL = 'http://192.168.1.18:8000' + '/my_ecom'
  const _token = ref('')
  const user = ref('')

  let _captchaKeyJWT = undefined
  let _headers = {
    'Authorization': `Token ${_token.value}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
 


  function isTokenExpired(token) {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    var decodedToken = JSON.parse(jsonPayload)
    var expirationDate = new Date(decodedToken.exp * 1000)

    return expirationDate < new Date()
  }

  const valideCaptcha = computed(() => {
    if (!_captchaKeyJWT){
      return false
    }
    return isTokenExpired(_captchaKeyJWT)
  })

  async function verifyCaptcha(email, captchaResponse){
    return await $fetch('/api/verify-captcha', { //'api/verify-captcha' est l'URL de votre endpoint de vérification du CAPTCHA
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        userEmail: email,
        captchaResponse: captchaResponse
      }
    })
    .then(data => {
      if (data.success) {
        return data.key // Renvoyer la clé du CAPTCHA
      } else {
        throw new Error('hCAPTCHA verification failed')
      }
    })
  }

  const getProfile = async () => {
    return await $fetch(BaseURL + '/users/me/', {
      'headers': _headers
    })
  }

  const logIn = async (email, password, captchaResponse) => {

    if (!valideCaptcha.value) {
      // Étape 1 : Vérifier le CAPTCHA
      // Token has expired or null
      console.log("Étape 1 : Vérifier le CAPTCHA")
      if (captchaResponse) {
        _captchaKeyJWT = await verifyCaptcha(email, captchaResponse)
        // Si la vérification du CAPTCHA échoue, arrêtez la fonction
        // verifyCaptcha() = undefined 
        if (!_captchaKeyJWT) {
          return { status: 'error', message: 'CAPTCHA verification failed', errorType: 'captcha_verification_failed' }
        }
      } else {
        // Appel de la function logIn(email, password) sans 'captchaResponse' & !valideCaptcha()
        // Il faut afficher un captcha 
        return { status: 'error', message: 'CAPTCHA has expired', errorType: 'captcha_expired' }
      }
    }
    console.log(_captchaKeyJWT)
    // Étape 2 : Effectuer la requête de login
    // Seulement si nous avons une clé de CAPTCHA valide
    let result = await $fetch( BaseURL + '/authToken/token/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        email: email,
        password: password,
        captchaKey: _captchaKeyJWT // Inclure la clé du CAPTCHA dans la requête
      }
    })
    .then((value) => {
      _token.value = value.auth_token // Mettre à jour le token dans le store
      user.value = email
      return { status: 'success', message: 'Success AuthToken' } // Renvoyer un objet en cas de succès
    })
    .catch(async error => {
      const errorData = error //await error.json() // Convertir le corps de l'erreur en JSON
      return { status: 'error', message: errorData, errorType: 'login_failed' } // Renvoyer un objet en cas d'erreur
    })
    return result
  }
  
  const logOut = async () => {
    user.value = ''
    _token.value = ''
    return await $fetch(BaseURL + '/authToken/token/logout/', {
      'headers': _headers
    })
  }

  return {
    getProfile,
    logIn,
    logOut,
    valideCaptcha
  }
})
