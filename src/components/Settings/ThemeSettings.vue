<script setup>
import { onMounted, ref, computed } from 'vue'
import TableTwo from '../Tables/TableTwo.vue'
const themeName = ref('')
const primaryColor = ref('#4f46e5') // Default primary color
const secondaryColor = ref('#9333ea') // Default secondary color
const textColor = ref('#000000') // Default text color
const backgroundColor = ref('#ffffff') // Default background color
const errors = ref({
  themeName: '',
  primaryColor: '',
  secondaryColor: '',
  textcolor: '',
  backgroundcolor: ''
})
const successMessage = ref('')
const themeUrl = 'http://192.168.100.243:5000/api/theme/get/active'
const createThemeEp = 'http://localhost:5000/api/theme/create/themes'
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

const handleCreateTheme = async () => {
  // Reset errors and messages
  errors.value = {
    themeName: '',
    primaryColor: '',
    secondaryColor: '',
    textColor: '',
    backgroundColor: ''
  }
  successMessage.value = ''

  // Basic validation for theme name
  if (!themeName.value) {
    errors.value.themeName = 'Theme name is required.'
    return
  }

  // HEX validation function
  const isValidHex = (color) => {
    return /^#[0-9A-Fa-f]{6}$/.test(color)
  }

  // Validate all HEX colors
  if (!isValidHex(colors.value.primaryColor)) {
    errors.value.primaryColor = 'Primary color must be a valid HEX color (#RRGGBB).'
  }
  if (!isValidHex(colors.value.secondaryColor)) {
    errors.value.secondaryColor = 'Secondary color must be a valid HEX color (#RRGGBB).'
  }
  if (!isValidHex(colors.value.textColor)) {
    errors.value.textColor = 'Text color must be a valid HEX color (#RRGGBB).'
  }
  if (!isValidHex(colors.value.backgroundColor)) {
    errors.value.backgroundColor = 'Background color must be a valid HEX color (#RRGGBB).'
  }

  // Check if any errors exist
  const hasErrors = Object.values(errors.value).some((error) => error !== '')
  if (hasErrors) {
    return
  }
  console.log()
  // Proceed with API call
  try {
    const response = await fetch(createThemeEp, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        themeName: themeName.value,
        primaryColor: colors.value.primaryColor,
        secondaryColor: colors.value.secondaryColor,
        textColor: colors.value.textColor,
        backgroundColor: colors.value.backgroundColor
      })
    })
    const data = await response.json()
    if (response.ok) {
      window.location.reload()

      Swal.fire({
        title: data.message,
        showConfirmButton: true,
        icon: 'success'
      })
      resetForm()
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

const resetForm = () => {
  themeName.value = ''
  primaryColor.value = '#4f46e5'
  secondaryColor.value = '#9333ea'
  textColor.value = '#000000'
  backgroundColor.value = '#ffffff'
}

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
      <h4 class="text-xl font-bold text-black dark:text-white">Active Theme</h4>
    </div>

    <!-- Table Header -->
    <div
      class="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
    >
      <div class="col-span-3 flex items-center">
        <p class="font-medium">Theme Name</p>
      </div>
      <div class="col-span-1 hidden items-center sm:flex">
        <p class="font-medium">Primary</p>
      </div>
      <div class="col-span-1 flex items-center">
        <p class="font-medium">Secondary</p>
      </div>
      <div class="col-span-1 flex items-center">
        <p class="font-medium">TextColor</p>
      </div>
      <div class="col-span-1 flex items-center">
        <p class="font-medium">Background</p>
      </div>
      <div class="col-span-1 flex items-center">
        <p class="font-medium">Created At</p>
      </div>
    </div>

    <!-- Table Rows -->
    <div
      class="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
    >
      <div class="col-span-3 flex items-center">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <!-- <div class="h-12.5 w-15 rounded-md">
            <img :src="product.imageSrc" :alt="`Product: ${product.name}`" />
          </div> -->
          <p class="text-sm font-medium text-black dark:text-white">
            {{ themeActiveData.themeName }}
          </p>
        </div>
      </div>
      <div class="col-span-1 hidden items-center sm:flex">
        <div
          class="w-5 h5 m-1 rounded-md"
          :style="{
            backgroundColor: themeActiveData?.primaryColor || '#9694FF',
            color: themeActiveData?.primaryColor
          }"
        >
          1
        </div>
        <p class="text-sm font-medium dark:text-white">{{ themeActiveData.primaryColor }}</p>
      </div>
      <div class="col-span-1 flex items-center">
        <div
          class="w-5 h5 m-1 rounded-md"
          :style="{
            backgroundColor: themeActiveData?.secondaryColor || '#9694FF',
            color: themeActiveData?.secondaryColor
          }"
        >
          1
        </div>
        <p class="text-sm font-medium text-black dark:text-white">
          ${{ themeActiveData.secondaryColor }}
        </p>
      </div>
      <div class="col-span-1 flex items-center">
        <div
          class="w-5 h5 m-1 rounded-md"
          :style="{
            backgroundColor: themeActiveData?.textColor || '#9694FF',
            color: themeActiveData?.textColor
          }"
        >
          1
        </div>
        <p class="text-sm font-medium text-black dark:text-white">
          {{ themeActiveData.textColor }}
        </p>
      </div>
      <div class="col-span-1 flex items-center">
        <div
          class="w-5 h5 m-1 rounded-md"
          :style="{
            backgroundColor: themeActiveData?.backgroundColor || '#9694FF',
            color: themeActiveData?.backgroundColor
          }"
        >
          1
        </div>
        <p class="text-sm font-medium">${{ themeActiveData.backgroundColor }}</p>
      </div>
      <div class="col-span-1 flex items-center">
        <p class="text-sm font-medium">
          {{
            new Intl.DateTimeFormat('en-PH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }).format(new Date(themeActiveData.createdAt))
          }}
        </p>
      </div>
    </div>
  </div>
  <div class="m-5"></div>
  <div>
    <TableTwo />
  </div>

  <div class="m-5"></div>
  <div class="max-w-2md mx-auto p-6 bg-white rounded-sm shadow-lg">
    <h2 class="text-2xl font-semibold text-center mb-6">Create New Theme</h2>

    <form @submit.prevent="handleCreateTheme">
      <div class="space-y-4 w-full">
        <!-- Theme Name -->
        <div>
          <label for="themeName" class="block text-sm font-medium text-gray-700">Theme Name</label>
          <input
            id="themeName"
            v-model="themeName"
            type="text"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter theme name"
            aria-required="true"
            required
          />
          <p v-if="errors.themeName" class="text-red-500 text-sm mt-1">{{ errors.themeName }}</p>
        </div>

        <!-- Color Inputs -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="primaryColor" class="block text-sm font-medium text-gray-700"
              >Primary Color</label
            >
            <div class="flex items-center">
              <input
                id="primaryColor"
                v-model="colors.primaryColor"
                type="color"
                class="mx-1 mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
              <input
                v-model="colors.primaryColor"
                type="text"
                id="primaryColorHex"
                class="w-full mx-1 mt-1 border border-gray-300 rounded-md p-2"
                placeholder="#000000"
                maxlength="7"
              />
            </div>
            <p v-if="!isValidHex(colors.primaryColor)" class="text-red-500 text-sm mt-1">
              Invalid HEX color. Use format #RRGGBB.
            </p>
            <p v-if="errors.primaryColor" class="text-red text-sm mt-1">
              {{ errors.primaryColor }}
            </p>
            <!-- <div class="color-preview" :style="{ backgroundColor: primaryColor }"></div> -->
          </div>
          <div>
            <label for="secondaryColor" class="block text-sm font-medium text-gray-700"
              >Secondary Color</label
            >
            <div class="flex items-center">
              <input
                id="secondaryColor"
                v-model="colors.secondaryColor"
                type="color"
                class="mx-1 mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
              <input
                v-model="colors.secondaryColor"
                type="text"
                id="secondaryColorHex"
                class="w-full mx-1 mt-1 border border-gray-300 rounded-md p-2"
                placeholder="#000000"
                maxlength="7"
              />
            </div>
            <p v-if="!isValidHex(colors.secondaryColor)" class="text-red-500 text-sm mt-1">
              Invalid HEX color. Use format #RRGGBB.
            </p>
            <p v-if="errors.secondaryColor" class="text-red text-sm mt-1">
              {{ errors.secondaryColor }}
            </p>
          </div>
          <div>
            <label for="textColor" class="block text-sm font-medium text-gray-700"
              >Text Color</label
            >
            <div class="flex items-center">
              <input
                id="textColor"
                v-model="colors.textColor"
                type="color"
                class="mx-1 mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
              <input
                v-model="colors.textColor"
                type="text"
                id="textColorHex"
                class="w-full mx-1 mt-1 border border-gray-300 rounded-md p-2"
                placeholder="#000000"
                maxlength="7"
              />
            </div>
            <p v-if="!isValidHex(colors.textColor)" class="text-red-500 text-sm mt-1">
              Invalid HEX color. Use format #RRGGBB.
            </p>
            <p v-if="errors.textColor" class="text-red text-sm mt-1">
              {{ errors.textColor }}
            </p>
          </div>
          <div>
            <label for="backgroundColor" class="block text-sm font-medium text-gray-700"
              >Background Color</label
            >
            <div class="flex items-center">
              <input
                id="backgroundColor"
                v-model="colors.backgroundColor"
                type="color"
                class="mx-1 mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
              <input
                v-model="colors.backgroundColor"
                type="text"
                id="backgroundColorHex"
                class="w-full mx-1 mt-1 border border-gray-300 rounded-md p-2"
                placeholder="#000000"
                maxlength="7"
              />
            </div>
            <p v-if="!isValidHex(colors.backgroundColor)" class="text-red-500 text-sm mt-1">
              Invalid HEX color. Use format #RRGGBB.
            </p>
            <p v-if="errors.backgroundColor" class="text-red text-sm mt-1">
              {{ errors.backgroundColor }}
            </p>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-6 text-center">
          <button
            type="submit"
            class="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
          >
            Create Theme
          </button>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mt-4 text-green-600 text-center">
          {{ successMessage }}
        </div>
      </div>
    </form>
  </div>
</template>
