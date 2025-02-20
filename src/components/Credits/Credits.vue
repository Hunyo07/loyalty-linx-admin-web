<script setup>
import { onMounted, ref, computed } from 'vue'
import TableTwo from '../Tables/TableTwo.vue'
const themeName = ref('')
const primaryColor = ref('#4f46e5') // Default primary color
const secondaryColor = ref('#9333ea') // Default secondary color
const textColor = ref('#000000') // Default text color
const backgroundColor = ref('#ffffff') // Default background color
const barrowers = ref([]) // Default background color
const errors = ref({
  themeName: '',
  primaryColor: '',
  secondaryColor: '',
  textcolor: '',
  backgroundcolor: ''
})
const successMessage = ref('')
const themeUrl = 'http://192.168.100.243:5000/api/theme/get/active'
const getBarrowersListEp = 'http://127.0.0.1:5000/api/admin//borrowers/'
const adminProfile = JSON.parse(localStorage.getItem('adminProfile'))
const adminToken = JSON.parse(localStorage.getItem('token'))
console.log()
const themeActiveData = ref({})
const colors = ref({
  primaryColor: '#000000',
  secondaryColor: '#FFFFFF',
  textColor: '#333333',
  backgroundColor: '#F0F0F0'
})
import Swal from 'sweetalert2'
const getActiveTheme = async () => {
  const response = await fetch(themeUrl, {
    method: 'GET'
  })
  const data = await response.json()
  if (response.ok) {
    localStorage.setItem('activeTheme', JSON.stringify(data))
  }
}
themeActiveData.value = JSON.parse(localStorage.getItem('activeTheme'))

const getBarrowersRequest = async () => {
  // Proceed with API call
  try {
    const response = await fetch(`${getBarrowersListEp}${adminProfile.merchantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken} `
      }
    })
    const data = await response.json()
    if (response.ok) {
      // window.location.reload()

      // Swal.fire({
      //   title: data.message,
      //   showConfirmButton: true,
      //   icon: 'success'
      // })
      barrowers.value = data.borrowersRequest
    } else {
      Swal.fire({
        title: data.message,
        showConfirmButton: true,
        icon: 'warning',
        timerProgressBar: true,
        timer: 1500
      })
    }
  } catch (e) {
    console.log(e)
  }
}
// const getTheme = async () => {
//   try {
//     const response = await fetch(themeUrl)
//     const data = await response.json() // Replace with your API endpoint
//     themeData.value = data
//   } catch (error) {
//     console.error('Error fetching data:', error)
//   }
// }

getBarrowersRequest()
onMounted(() => {
  // getTheme()
  getActiveTheme()
})
const isValidHex = (color) => {
  return /^#[0-9A-Fa-f]{6}$/.test(color)
}
</script>

<style scoped>
/* Optional: Customize the form's button hover state */
button:hover {
  transition: background-color 0.3s ease;
}

/* Color input preview */
.color-preview {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #ccc;
  display: inline-block;
  margin-left: 8px;
}
</style>

<template>
  <div class="m-5"></div>
  <div
    class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="py-6 px-4 md:px-6 xl:px-7.5">
      <h4 class="text-xl font-bold text-black dark:text-white">Credits Request List</h4>
    </div>

    <!-- Table Header -->
    <div
      class="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
    >
      <div class="col-span-2 flex items-center">
        <p class="font-medium">Name</p>
      </div>
      <div class="col-span-1 hidden items-center sm:flex">
        <p class="font-medium">Inc. Src.</p>
      </div>
      <div class="col-span-1 flex items-center">
        <p class="font-medium">Inc. Amt.</p>
      </div>
      <div class="col-span-1 flex items-center">
        <p class="font-medium">Req. Loan</p>
      </div>
      <div class="col-span-1 flex items-center">
        <p class="font-medium">Appl. Date</p>
      </div>
      <div class="col-span-1 flex items-center">
        <p class="font-medium">Status</p>
      </div>

      <div class="col-span-1 flex items-center">
        <p class="font-medium">Option</p>
      </div>
    </div>

    <!-- Table Rows -->
    <div
      v-for="list in barrowers"
      :key="list.userId"
      class="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
    >
      <div class="col-span-2 flex items-center">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <!-- <div class="h-12.5 w-15 rounded-md">
            <img :src="product.imageSrc" :alt="`Product: ${product.name}`" />
          </div> -->
          <p class="text-sm font-medium text-black dark:text-white">
            {{ list.userName }}
          </p>
        </div>
      </div>

      <div class="col-span-1 flex items-center">
        <p class="text-sm font-medium text-black dark:text-white">{{ list.incomeSource }}</p>
      </div>
      <div class="col-span-1 flex items-center">
        <p class="text-sm font-medium text-black dark:text-white">
          ₱ {{ list.incomeSourceAmount }}
        </p>
      </div>

      <div class="col-span-1 flex items-center">
        <p class="text-sm font-medium text-black dark:text-white">₱ {{ list.creditAmount }}</p>
      </div>
      <div class="col-span-1 flex items-center">
        <p class="text-sm font-medium text-black dark:text-white">
          {{
            new Intl.DateTimeFormat('en-PH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }).format(new Date(list.applicationDate))
          }}
        </p>
      </div>
      <div class="col-span-1 flex items-center">
        <p class="text-sm font-medium">{{ list.status }}</p>
      </div>
      <div class="col-span-1 flex items-center">
        <p
          @click="openEditModal(theme)"
          class="cursor-pointer mr-2 text-amber-400 font-medium"
          type="button"
        >
          Edit
        </p>
      </div>
    </div>
  </div>
</template>
