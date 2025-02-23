<script setup>
import DefaultAuthCard from '@/components/Auths/DefaultAuthCard.vue'
import InputGroup from '@/components/Auths/InputGroup.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref } from 'vue'
const loginEp = 'http://192.168.100.206:5000/api/admin/login'
const themeUrl = 'http://192.168.100.206:5000/api/theme/get/active'
const email = ref('')
const password = ref('')
const error = ref(null)
const passwordVisible = ref(false) // State to toggle password visibility

// const togglePasswordVisibility = () => {
//   passwordVisible.value = !passwordVisible.value // Toggle visibility state
// }
const getActiveTheme = async () => {
  const response = await fetch(themeUrl, {
    method: 'GET'
  })
  const data = await response.json()
  if (response.ok) {
    localStorage.setItem('activeTheme', JSON.stringify(data))
  }
}
const handleSignIn = async () => {
  try {
    const response = await fetch(loginEp, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        role: 'admin'
      })
    })
    const data = await response.json()
    if (response.ok) {
      getActiveTheme()
      localStorage.setItem('token', JSON.stringify(data.token))
      localStorage.setItem('adminProfile', JSON.stringify(data.adminProfile))

      router.push({
        path: '/ecommerce'
      })
    } else {
      console.log(`its failed ${data.message}`)
      error.value = data.message
    }
  } catch (e) {
    console.log(e)
  }
}
const handlePasswordVisible = () => (passwordVisible.value ^= true)
</script>

<template>
  <div class="p-20">
    <DefaultAuthCard subtitle="" title="Sign In to Loyalty Linx Admin">
      <form>
        <div class="mb-6">
          <label
            for="large-input"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Email</label
          >
          <input
            placeholder="Email"
            v-model="email"
            type="text"
            id="large-input"
            class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <!-- <div class="mb-6">
        <label
          for="large-input"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Email</label
        >
        <input
          :type="passwordVisible ? 'text ' : 'password'"
          placeholder="6+ Characters, 1 Capital letter"
          v-model="password"
          id="large-input"
          class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div> -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium leading-5 text-gray-700">
            Password
          </label>
          <div class="mt-1 rounded-md shadow-sm relative">
            <input
              v-model="password"
              id="password"
              name="password"
              :type="passwordVisible ? 'text ' : 'password'"
              required="true"
              placeholder="6+ Characters, 1 Capital letter"
              class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <svg
              @click="handlePasswordVisible"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="cursor-pointer hover:shadow-2 rounded-md size-6 absolute top-4 right-2"
            >
              <path
                v-if="passwordVisible"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                v-if="passwordVisible"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          </div>
        </div>
        <p v-if="error" class="text-red">
          {{ error }}
        </p>

        <div class="mb-5 mt-6">
          <router-link to="" @click="handleSignIn">
            <input
              type="submit"
              value="Sign In"
              class="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
            />
          </router-link>
        </div>

        <button
          class="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 font-medium hover:bg-opacity-70 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-70"
        >
          <span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_191_13499)">
                <path
                  d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
                  fill="#4285F4"
                />
                <path
                  d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
                  fill="#34A853"
                />
                <path
                  d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                  fill="#FBBC05"
                />
                <path
                  d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                  fill="#EB4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_191_13499">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          Sign in with Google
        </button>

        <div class="mt-6 text-center">
          <p class="font-medium">
            Don’t have any account?
            <router-link to="/auth/signup" class="text-primary">Sign up</router-link>
          </p>
        </div>
      </form>
    </DefaultAuthCard>
  </div>
</template>
