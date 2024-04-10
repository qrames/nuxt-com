import * as jose from 'jose'


const VERIFY_URL: string = "https://api.hcaptcha.com/siteverify"

interface Event {
  captchaResponse: string
}

interface Body {
  userEmail: string
  captchaResponse: string
}

interface ApiResponse {
  success?: boolean
  key?: string
  error?: string[]
}

interface ReshCaptcha {
  success: boolean
  challenge_ts: string
  hostname: string
  credit?: boolean
  "error-codes"?: string[]
  "score"?: number
  "score_reason"?: string[]
}

function generateToken(userEmail: string, ip: string, expiration: string): Promise<string> {
  let expirationDate = new Date(expiration);
  let expirationTime = Math.floor(expirationDate.getTime() / 1000);

  return new jose.SignJWT({ 'userEmail': userEmail, 'ip': ip })// crée un nouveau JWT avec le userEmail comme payload.
  .setProtectedHeader({ alg: 'HS256' })// définit l’algorithme utilisé pour signer le token comme étant ‘HS256’.
  .setIssuedAt()// définit la date et l’heure d’émission du token à l’heure actuelle.
  .setExpirationTime(expirationTime)// définit la date et l’heure d’expiration du token à la valeur spécifiée par expiration.
  .sign(Buffer.from(process.env.TOKEN_SECRET!, 'utf-8')!)// signe le token avec la clé secrète spécifiée par process.env.TOKEN_SECRET
}


export default defineEventHandler(async (event) => {
  const body: Body = await readBody(event)
  
  // Récupérez le token à partir des données POST avec la clé 'h-captcha-response'.
  const response: string = body.captchaResponse

  // Construisez le payload avec la clé secrète et le token.
  //let data: { secret: string | undefined, response: string } = { 'secret': process.env.SECRET_KEY_HCAPTCHAT, 'response': response }
  let data = new URLSearchParams()
  data.append('secret', process.env.SECRET_KEY_HCAPTCHAT!)
  data.append('response', response)
  // Faites une requête POST avec le payload de données à l'endpoint de l'API hCaptcha.
  let apiResponse: ApiResponse = {}
  try {
    const res: ReshCaptcha = await $fetch(VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    })
    if (res && res['success']) {
      // Le CAPTCHA a été vérifié avec succès.
      const email: string = body.userEmail
      const client_ip: string = event?.node?.req.headers['host'].split(':')[0] ?? 'no host'
      const client_User_Agent: string | string[] = event?.node?.req.headers['user-agent'] ?? 'no User-Agent'
      let client_data = [client_ip, client_User_Agent]
      console.log(client_data)
      console.log(event.node.req.headers['x-forwarded-for'])
      console.log(event.node.req.headers['x-forwarded-for'])
      console.log(event.node.req.headers['x-forwarded-for'])
      //console.log(event?.node?.req.headers['user-agent'])
      console.log(event?.node?.req.headers)
      const token = await generateToken(email, client_ip, res['challenge_ts'])
      apiResponse = {success: true, key: token}
    } else if (res && !res['success'] && res['error-codes']) {
      // Le CAPTCHA a été vérifié avec succès.

      apiResponse = {success: false, error: res['error-codes']}
    } else {
      // La vérification du CAPTCHA a échoué.
      apiResponse = {error: ['hcaptcha-api-error']}
    }
  } catch (error) {
    // Gérez les erreurs ici.
    console.log(error)
    apiResponse = {success: false, error: ['API catch error']}
  }
  return apiResponse
})