<script setup>
import { googleAuthCodeLogin } from 'vue3-google-login'
import { ref, onMounted } from 'vue'
import PersonCard from '@/components/PersonCard.vue'
import http from '@/http'
import CloseIcon from 'vue-material-design-icons/Close.vue'
import CheckIcon from 'vue-material-design-icons/Check.vue'

// state variables
const isLoggedIn = ref(false)
const user = ref({
  id: '',
  name: '',
  email: '',
})

const token = ref('')
// const user = ref({
//   name: 'Sai Voruganti',
//   email: 'sv3770@princeton.edu',
// })
const randomPerson = ref(null)
const numYes = ref(0)
const numNo = ref(0)

const y28 = ref(false)
const y27 = ref(false)
const y26 = ref(false)
const y25 = ref(false)

const googleLogin = async () => {
  try {
    const codeData = await googleAuthCodeLogin()

    if (codeData.hd !== 'princeton.edu') {
      alert('You must login with a @princeton.edu email!')
      return
    }

    const { data } = await http.post('/auth', { code: codeData.code })

    token.value = data.token
    http.defaults.headers.common['Authorization'] = data.token
    localStorage.setItem('token', data.token)

    user.value = {
      id: data.user._id,
      name: data.user.name,
      email: data.user.email,
    }
    numYes.value = data.user.yesUsers.length
    numNo.value = data.user.noUsers.length

    isLoggedIn.value = true

    getNextPerson()
  } catch (e) {
    console.log('login error', e)
    alert('An unknown error occurred, please try again later.')
  }
}

const onLogout = () => {
  delete http.defaults.headers.common['Authorization']
  token.value = ''
  localStorage.removeItem('token')
  user.value = {
    id: '',
    name: '',
    email: '',
  }
  numYes.value = 0
  numNo.value = 0
  isLoggedIn.value = false
}

onMounted(async () => {
  const lToken = localStorage.getItem('token')
  if (lToken) {
    token.value = lToken

    http.defaults.headers.common['Authorization'] = lToken

    const { data } = await http.get('/user')

    user.value = {
      id: data.user._id,
      name: data.user.name,
      email: data.user.email,
    }
    numYes.value = data.user.yesUsers.length
    numNo.value = data.user.noUsers.length

    isLoggedIn.value = true
    getNextPerson()
  }
})

const getNextPerson = async () => {
  const years = []

  if (y28.value) {
    years.push('2028')
  }
  if (y27.value) {
    years.push('2027')
  }
  if (y26.value) {
    years.push('2026')
  }
  if (y25.value) {
    years.push('2025')
  }

  const { data } = await http.get('/next', {
    params: { ue: user.value.email, years: years.toString() },
  })

  // console.log(data)

  randomPerson.value = data.person
}

const onMatchAction = async (action) => {
  if (action === 'accept') {
    numYes.value++
  } else {
    numNo.value++
  }
  await http.post('/match_action', {
    ue: user.value.email,
    se: randomPerson.value.email,
    action,
  })
  getNextPerson()
}
</script>

<template>
  <main>
    <h1 class="text-5xl font-bold text-center mt-8">TigerMatch</h1>
    <div class="flex justify-center px-20 mt-5">
      <div v-if="!isLoggedIn">
        <div>
          <h3 class="font-semibold text-2xl">How it works:</h3>
          <div class="text-lg">
            <p>
              1. Sign in (with your Princeton email) and
              <span class="font-bold">swipe through people</span>
            </p>
            <p>
              2. If you <span class="font-bold">match with someone</span>, you will both be notified
              via email
            </p>
            <p>3. Your non-matches will <span class="font-bold">not be seen by anyone</span></p>
          </div>
        </div>
        <div class="flex justify-center mt-12">
          <!-- <GoogleLogin :callback="login" /> -->
          <button @click="googleLogin" class="bg-white px-3 py-2 rounded border-2 font-bold">
            Login with Google
          </button>
        </div>
      </div>

      <div v-else>
        <p class="text-xl font-semibold text-center">Welcome, {{ user.name }} ({{ user.email }})</p>
        <p class="font-medium text-center">Your Stats: {{ numNo }} No, {{ numYes }} Yes</p>
        <p @click="onLogout" class="text-center text-red-800 cursor-pointer">Logout</p>
        <ul class="flex justify-center space-x-4 text-lg mt-3">
          <li>
            <input type="checkbox" id="c28" v-model="y28" />
            <label for="c28" class="ml-1">2028</label>
          </li>
          <li>
            <input type="checkbox" id="c27" v-model="y27" />
            <label for="c27" class="ml-1">2027</label>
          </li>
          <li>
            <input type="checkbox" id="c26" v-model="y26" />
            <label for="c26" class="ml-1">2026</label>
          </li>
          <li>
            <input type="checkbox" id="c25" v-model="y25" />
            <label for="c25" class="ml-1">2025</label>
          </li>
        </ul>

        <div class="mt-2">
          <PersonCard v-if="randomPerson" :person="randomPerson" />

          <div class="flex justify-center space-x-10 mt-4 mb-10">
            <button class="bg-red-700 action-button" @click="onMatchAction('reject')">
              <CloseIcon />
            </button>

            <button class="bg-green-700 action-button" @click="onMatchAction('accept')">
              <CheckIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="postcss">
.action-button {
  @apply px-10 py-4 rounded-full flex justify-center align-middle text-white text-xl;
}
</style>
