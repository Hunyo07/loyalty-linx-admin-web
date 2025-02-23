<script setup>
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

// State
const barrowers = ref([])
const showActionModal = ref(false)
const selectedBarrower = ref(null)

// API endpoints and auth
const getBarrowersListEp = 'http://127.0.0.1:5000/api/admin//borrowers/'
const adminProfile = JSON.parse(localStorage.getItem('adminProfile'))
const adminToken = JSON.parse(localStorage.getItem('token'))

const selectedStatus = ref('all')
const showPaymentModal = ref(false)
const selectedPaymentLog = ref(null)
const searchQuery = ref('')

const filteredBorrowers = computed(() => {
  let filtered = barrowers.value
  
  // Filter by status
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(barrower => barrower.status === selectedStatus.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(barrower => 
      barrower.userName.toLowerCase().includes(query)
    )
  }
  
  return filtered
})


// Methods
const getBarrowersRequest = async () => {
  try {
    const response = await fetch(`${getBarrowersListEp}${adminProfile.merchantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      }
    })
    const data = await response.json()
    if (response.ok) {
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
    console.error('Error fetching borrowers:', e)
  }
}
const openPaymentModal = (barrower) => {
  selectedBarrower.value = barrower
  selectedPaymentLog.value = barrower.paymentLog
  showPaymentModal.value = true
}
const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedBarrower.value = null
  selectedPaymentLog.value = null
}

const openActionModal = (barrower) => {
  selectedBarrower.value = barrower
  showActionModal.value = true
}

const closeActionModal = () => {
  showActionModal.value = false
  selectedBarrower.value = null
}
// Update the handleAction function
const handleAction = async (action) => {
  try {
    if (!selectedBarrower.value) {
      Swal.fire({
        title: 'Error!',
        text: 'No borrower selected',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }

    const response = await fetch(
      `http://127.0.0.1:5000/api/admin/approve-borrower-request/${selectedBarrower.value.creditRequestNumber}/${adminProfile.merchantId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: action,
          role: adminProfile.role // Add the admin role
        })
      }
    )
          console.log(action);

    const data = await response.json()
    if (response.ok) {
      Swal.fire({
        title: 'Success!',
        text: data.message,
        icon: 'success',
        confirmButtonText: 'OK'
      })
      await getBarrowersRequest() // Refresh the list
    } else {
      Swal.fire({
        title: 'Error!',
        text: data.message,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
    closeActionModal()
  } catch (error) {
    console.error('Error:', error)
    Swal.fire({
      title: 'Error!',
      text: 'Something went wrong',
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }
}

// Initialize
onMounted(() => {
  getBarrowersRequest()
})
</script>

<style scoped>
.bg-success {
  background-color: #10b981;
}
.bg-danger {
  background-color: #ef4444;
}
</style>

<template>
  <div class="m-5"></div>
  <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    
    
   
        <div class="py-4 px-4 md:px-6 xl:px-7.5 flex items-center justify-between">
  <h4 class="text-xl font-bold text-black dark:text-white">Credits Request List</h4>
  <div class="flex items-center space-x-4">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name..."
        class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 dark:bg-boxdark"
      />
      <svg
        v-if="searchQuery"
        @click="searchQuery = ''"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <div class="flex items-center space-x-2">
      <label class="text-sm font-medium">Status Filter:</label>
      <select 
        v-model="selectedStatus"
        class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 dark:bg-boxdark"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
        
      </div>
    </div>
    <!-- Table Header -->
    <div class="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
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
        <p class="font-medium">Action</p>
      </div>
    </div>
    <div 
      v-if="!filteredBorrowers.length"
      class="py-8 px-4 text-center border-t border-stroke dark:border-strokedark"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-16 h-16 mx-auto text-gray-400 mb-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
      <p class="text-gray-500 dark:text-gray-400 text-lg">No records found</p>
      <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">
        {{ selectedStatus === 'all' ? 'There are no credit requests available.' : `No ${selectedStatus} requests found.` }}
      </p>
    </div>
    <!-- Table Rows -->
    <div v-else v-for="list in filteredBorrowers" :key="list.userId">
      <div 
        class="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
      >
        <div class="col-span-2 flex items-center">
          <p class="text-sm font-medium text-black dark:text-white">
            {{ list.userName }}
          </p>
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
            {{ new Intl.DateTimeFormat('en-PH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }).format(new Date(list.applicationDate)) }}
          </p>
        </div>

        <div class="col-span-1 flex items-center">
          <p class="text-sm font-medium">{{ list.status }}</p>
        </div>

        <div class="col-span-1 flex items-center">
          <button
    v-if="list.status === 'pending'"
    @click="openActionModal(list)"
    class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  </button>
  <button
    v-else-if="list.status === 'approved'"
    @click="openPaymentModal(list)"
    class="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  </button>
        </div>
      </div>
    </div>

    <!-- Action Modal -->
    <div v-if="showActionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[500px] dark:bg-boxdark">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Credit Request Details</h3>
          <button @click="closeActionModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
    
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p class="text-sm text-gray-600 mb-1">Borrower Name</p>
            <p class="font-medium">{{ selectedBarrower?.userName }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Income Source</p>
            <p class="font-medium">{{ selectedBarrower?.incomeSource }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Monthly Income</p>
            <p class="font-medium">₱{{ selectedBarrower?.incomeSourceAmount }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Requested Amount</p>
            <p class="font-medium">₱{{ selectedBarrower?.creditAmount }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Monthly Payment</p>
            <p class="font-medium">₱{{ new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(selectedBarrower?.monthlyInstallment || 0)  }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Term</p>
            <p class="font-medium">{{ selectedBarrower?.term }} months</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Application Date</p>
            <p class="font-medium">{{ new Date(selectedBarrower?.applicationDate).toLocaleDateString('en-PH') }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Status</p>
            <p class="font-medium capitalize">{{ selectedBarrower?.status }}</p>
          </div>
        </div>
    
        <div class="border-t pt-4">
          <div class="flex flex-col space-y-2">
            <button
              @click="handleAction('approved')"
              class="px-4 py-2 bg-success text-white rounded hover:bg-success/80"
            >
              Approve Request
            </button>
            <button
              @click="handleAction('reject')"
              class="px-4 py-2 bg-danger text-white rounded hover:bg-danger/80"
            >
              Reject Request
            </button>
            <button
              @click="closeActionModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Move the payment modal outside of the main container div -->

<!-- Payment Modal -->
<div v-if="showPaymentModal" class="fixed mt-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto dark:bg-boxdark">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Payment Schedule Details</h3>
      <button @click="closePaymentModal" class="text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div>
        <p class="text-sm text-gray-600 mb-1">Borrower Name</p>
        <p class="font-medium">{{ selectedBarrower?.userName }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600 mb-1">Total Loan Amount</p>
        <p class="font-medium">₱{{ selectedBarrower?.creditAmount }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600 mb-1">Monthly Payment</p>
        <p class="font-medium">₱{{ new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(selectedBarrower?.monthlyInstallment || 0) }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600 mb-1">Term</p>
        <p class="font-medium">{{ selectedBarrower?.term }} months</p>
      </div>
    </div>

    <div class="border-t pt-4">
      <h4 class="font-semibold mb-3">Payment Schedule</h4>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left">Payment Date</th>
              <th class="px-4 py-2 text-left">Amount</th>
              <th class="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(payment, index) in selectedPaymentLog" :key="index">
              <td class="px-4 py-2">
                {{ new Date(payment.paymentDate).toLocaleDateString('en-PH') }}
              </td>
              <td class="px-4 py-2">
                ₱{{ new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(payment.paymentAmount) }}
              </td>
              <td class="px-4 py-2">
                <span 
                  :class="{
                    'px-2 py-1 rounded text-xs font-semibold': true,
                    'bg-green-100 text-green-800': payment.status === 'paid',
                    'bg-red-100 text-red-800': payment.status === 'unpaid',
                    'bg-yellow-100 text-yellow-800': payment.status === 'pending'
                  }"
                >
                  {{ payment.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="border-t mt-4 pt-4 flex justify-end">
      <button
        @click="closePaymentModal"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        Close
      </button>
    </div>
  </div>
</div>
</template>