<script setup>
import { onMounted, ref, computed } from 'vue'

// import ProductOne from '@/assets/images/product/product-01.png'
// import ProductTwo from '@/assets/images/product/product-02.png'
// import ProductThree from '@/assets/images/product/product-03.png'
// import ProductFour from '@/assets/images/product/product-04.png'

import Swal from 'sweetalert2'
const themeUrl = 'http://localhost:5000/api/theme/themes'
const themeData = ref({})
const isModalOpen = ref(false)
// const selectedTheme = ref({})
const selectedTheme = ref({
  primaryColor: '#000000',
  secondaryColor: '#FFFFFF',
  textColor: '#333333'
})
const setActiveThemeUp = 'http://localhost:5000/api/theme/set/active'
const deleteThemeEp = 'http://localhost:5000/api/theme/delete/'
const getTheme = async () => {
  try {
    const response = await fetch(themeUrl)
    const data = await response.json()

    if (response.ok) {
      themeData.value = data
      localStorage.setItem('theme', JSON.stringify(data))
    } else {
      console.log(data.message)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
themeData.value = JSON.parse(localStorage.getItem('theme'))
const openEditModal = (theme) => {
  selectedTheme.value = theme
  isModalOpen.value = true
  console.log(selectedTheme.value)
}

const handleEditTheme = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/theme/update/${selectedTheme.value._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedTheme.value)
      }
    )
    const data = await response.json()

    if (response.ok) {
      Swal.fire({
        title: data.message,
        icon: 'success',
        showConfirmButton: true,
        timerProgressBar: true,
        timer: 1500
      })
      window.location.reload()
      closeModal()
    } else {
      Swal.fire({
        title: data.message,
        icon: 'error',
        showConfirmButton: true
      })
    }
  } catch (error) {
    console.error('Error updating theme:', error)
  }
}
const handleSetActive = async (theme) => {
  try {
    const response = await fetch(setActiveThemeUp, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        activeThemeId: theme._id
      })
    })
    const data = await response.json()

    if (response.ok) {
      Swal.fire({
        title: data.message,
        showConfirmButton: false,
        icon: 'success',
        timerProgressBar: true,
        timer: 1500
      }).then(() => {
        window.location.reload()
      })
    } else {
      Swal.fire({
        title: data.message,
        showConfirmButton: true,
        icon: 'warning'
      })
    }
  } catch (e) {
    console.log(e)
  }
}
const closeModal = () => {
  isModalOpen.value = false
}
onMounted(() => {
  getTheme()
})
// const products = ref([
//   {
//     id: 1,
//     name: 'Apple Watch Series 7',
//     category: 'Electronics',
//     price: 269,
//     sold: 22,
//     profit: 45,
//     imageSrc: ProductOne
//   },
//   {
//     id: 2,
//     name: 'Macbook Pro M1',
//     category: 'Electronics',
//     price: 546,
//     sold: 34,
//     profit: 125,
//     imageSrc: ProductTwo
//   },
//   {
//     id: 3,
//     name: 'Dell Inspiron 15',
//     category: 'Electronics',
//     price: 443,
//     sold: 64,
//     profit: 247,
//     imageSrc: ProductThree
//   },
//   {
//     id: 4,
//     name: 'HP Probook 450',
//     category: 'Electronics',
//     price: 499,
//     sold: 72,
//     profit: 103,
//     imageSrc: ProductFour
//   }
// ])
const handleDeleteTheme = async (id) => {
  Swal.fire({
    title: 'Are you sure you want to delete this theme?',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    denyButtonText: 'Cancel',
    icon: 'warning',
    confirmButtonColor: '#d33', // Confirm button color
    cancelButtonColor: '#3085d6' // Cancel button color
  }).then(async (result) => {
    // Move async here
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${deleteThemeEp}${id}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        if (response.ok) {
          window.location.reload()
          console.log(data.message)
        } else {
          console.log(data.message)
        }
      } catch (e) {
        console.log(e)
      }
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })
}
const isValidHex = (colorKey) => {
  const colorValue = selectedTheme.value[colorKey]
  return /^#[0-9A-Fa-f]{6}$/.test(colorValue)
}
</script>

<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Edit Theme</h2>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1" for="themeName">Theme Name</label>
        <input
          v-model="selectedTheme.themeName"
          type="text"
          id="themeName"
          readonly
          class="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1" for="primaryColor">Primary Color</label>
        <div class="flex justify-center items-center">
          <input
            v-model="selectedTheme.primaryColor"
            type="color"
            id="primaryColor"
            class="w-50 h-10 border mx-1 border-gray-300 rounded-md"
          />
          <input
            v-model="selectedTheme.primaryColor"
            type="text"
            id="primaryColorHex"
            class="w-full mx-1 border border-gray-300 rounded-md p-2"
            placeholder="#000000"
            maxlength="7"
          />
        </div>
        <p v-if="!isValidHex('primaryColor')" class="text-red-500 text-sm mt-1">
          Invalid HEX color. Use format #RRGGBB.
        </p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1" for="secondaryColor">Secondary Color</label>
        <div class="flex justify-center items-center">
          <input
            v-model="selectedTheme.secondaryColor"
            type="color"
            id="primaryColor"
            class="w-50 h-10 border mx-1 border-gray-300 rounded-md"
          />
          <input
            v-model="selectedTheme.secondaryColor"
            type="text"
            id="primaryColorHex"
            class="w-full mx-1 border border-gray-300 rounded-md p-2"
            placeholder="#000000"
            maxlength="7"
          />
        </div>
        <p v-if="!isValidHex('secondaryColor')" class="text-red-500 text-sm mt-1">
          Invalid HEX color. Use format #RRGGBB.
        </p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1" for="textColor">Text Color</label>
        <div class="flex justify-center items-center">
          <input
            v-model="selectedTheme.textColor"
            type="color"
            id="primaryColor"
            class="w-50 h-10 border mx-1 border-gray-300 rounded-md"
          />
          <input
            v-model="selectedTheme.textColor"
            type="text"
            id="primaryColorHex"
            class="w-full mx-1 border border-gray-300 rounded-md p-2"
            placeholder="#000000"
            maxlength="7"
          />
        </div>
        <p v-if="!isValidHex('textColor')" class="text-red-500 text-sm mt-1">
          Invalid HEX color. Use format #RRGGBB.
        </p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1" for="backgroundColor">Background Color</label>
        <div class="flex justify-center items-center">
          <input
            v-model="selectedTheme.backgroundColor"
            type="color"
            id="primaryColor"
            class="w-50 h-10 border mx-1 border-gray-300 rounded-md"
          />
          <input
            v-model="selectedTheme.backgroundColor"
            type="text"
            id="primaryColorHex"
            class="w-full mx-1 border border-gray-300 rounded-md p-2"
            placeholder="#000000"
            maxlength="7"
          />
        </div>
        <p v-if="!isValidHex('backgroundColor')" class="text-red-500 text-sm mt-1">
          Invalid HEX color. Use format #RRGGBB.
        </p>
      </div>

      <div class="flex justify-end gap-2">
        <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
          Cancel
        </button>
        <button
          @click="handleEditTheme"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
  <div
    class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="py-6 px-4 md:px-6 xl:px-7.5">
      <h4 class="text-xl font-bold text-black dark:text-white">Themes</h4>
    </div>

    <!-- Table Header -->
    <div
      class="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
    >
      <div class="col-span-2 flex items-center">
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
      <div class="col-span-2 flex items-center">
        <p class="font-medium">Options</p>
      </div>
    </div>

    <!-- Table Rows -->
    <div
      v-for="theme in themeData"
      :key="theme"
      class="grid grid-cols-5 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
    >
      <div class="col-span-2 flex items-center">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <!-- <div class="h-12.5 w-15 rounded-md">
            <img :src="product.imageSrc" :alt="`Product: ${product.name}`" />
          </div> -->
          <p class="text-sm font-medium text-black dark:text-white">{{ theme.themeName }}</p>
        </div>
      </div>
      <div class="col-span-1 hidden items-center sm:flex">
        <div
          class="w-5 h5 m-1 rounded-md"
          :style="{
            backgroundColor: theme?.primaryColor || '#9694FF',
            color: theme?.primaryColor
          }"
        >
          1
        </div>
        <p class="text-sm font-medium dark:text-white">{{ theme.primaryColor }}</p>
      </div>
      <div class="col-span-1 flex items-center">
        <div
          class="w-5 h5 m-1 rounded-md"
          :style="{
            backgroundColor: theme?.secondaryColor || '#9694FF',
            color: theme?.secondaryColor
          }"
        >
          1
        </div>
        <p class="text-sm font-medium text-black dark:text-white">{{ theme.secondaryColor }}</p>
      </div>
      <div class="col-span-1 flex items-center">
        <div
          class="w-5 h5 m-1 rounded-md"
          :style="{
            backgroundColor: theme?.textColor || '#9694FF',
            color: theme?.textColor
          }"
        >
          1
        </div>
        <p class="text-sm font-medium text-black dark:text-white">{{ theme.textColor }}</p>
      </div>
      <div class="col-span-1 flex items-center">
        <div
          class="w-5 h5 m-1 rounded-md"
          :style="{
            backgroundColor: theme?.backgroundColor || '#9694FF',
            color: theme?.backgroundColor
          }"
        >
          1
        </div>
        <p class="text-sm font-medium">{{ theme.backgroundColor }}</p>
      </div>

      <div class="col-span-2 flex items-center">
        <p
          @click="openEditModal(theme)"
          class="cursor-pointer mr-2 text-amber-400 font-medium"
          type="button"
        >
          Edit
        </p>
        <p
          @click="handleDeleteTheme(theme._id)"
          class="cursor-pointer mr-2 text-red font-medium"
          type="button"
        >
          Delete
        </p>
        <p
          class="cursor-pointer mr-2 text-green-500 font-medium"
          @click="handleSetActive(theme)"
          type="button"
        >
          Set Active
        </p>
      </div>
    </div>
  </div>
</template>
