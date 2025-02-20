import { createRouter, createWebHistory } from 'vue-router'

import SigninView from '@/views/Authentication/SigninView.vue'
import SignupView from '@/views/Authentication/SignupView.vue'
import CalendarView from '@/views/CalendarView.vue'
import BasicChartView from '@/views/Charts/BasicChartView.vue'
import ECommerceView from '@/views/Dashboard/ECommerceView.vue'
import FormElementsView from '@/views/Forms/FormElementsView.vue'
import FormLayoutView from '@/views/Forms/FormLayoutView.vue'
import SettingsView from '@/views/Pages/SettingsView.vue'
import TablesView from '@/views/TablesView.vue'
import AlertsView from '@/views/UiElements/AlertsView.vue'
import ButtonsView from '@/views/UiElements/ButtonsView.vue'
import AccountView from '@/views/Pages/Settings/AccountView.vue'
import NotificationView from '@/views/Pages/Settings/NotificationView.vue'
// import ProfileView from '@/views/Pages/Settings/ProfileView.vue'
import ProfileViews from '@/views/ProfileView.vue'
import ThemeView from '@/views/Pages/Settings/ThemeView.vue'
import ProfileView from '@/views/Pages/Settings/ProfileView.vue'
import Credits from '@/views/Pages/CreditsView.vue'
// import SigninView from '../views/Authentication/SigninView.vue'
// import AccountSettings from '@/views/Pages/Settings/AccountView.vue'
// import NotificationSetting from '@/views/Pages/Settings/NotificationView.vue'
// import ProfileSetting from '@/components/Settings/ProfileSetting.vue'
// import ThemeSettings from '@/components/Settings/ThemeSettings.vue'
function isAuthenticated() {
  return !!localStorage.getItem('token') // Check if auth token exists
}

const routes = [
  {
    path: '/',
    name: 'signin',
    component: SigninView,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next({ name: 'eCommerce' }) // Redirect logged-in users to Dashboard
      } else {
        next()
      }
    },
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/ecommerce',
    name: 'eCommerce',
    component: ECommerceView,

    meta: { requiresAuth: true, title: 'eCommerce Dashboard' } // Protect this route
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView,
    meta: {
      title: 'Calendar',
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileViews,
    meta: {
      title: 'Profile'
    }
  },
  {
    path: '/settings/profile',
    name: 'profile settings',
    component: ProfileView,
    meta: {
      title: 'Profile Settings'
    }
  },
  {
    path: '/credits',
    name: 'credits',
    component: Credits,
    meta: {
      title: 'Manage Credits'
    }
  },
  {
    path: '/forms/form-elements',
    name: 'formElements',
    component: FormElementsView,
    meta: {
      title: 'Form Elements'
    }
  },
  {
    path: '/forms/form-layout',
    name: 'formLayout',
    component: FormLayoutView,
    meta: {
      title: 'Form Layout',
      requiresAuth: true
    }
  },
  {
    path: '/tables',
    name: 'tables',
    component: TablesView,
    meta: {
      title: 'Tables',
      requiresAuth: true
    }
  },
  {
    path: '/pages/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: 'Settings',
      requiresAuth: true
    }
  },
  {
    path: '/charts/basic-chart',
    name: 'basicChart',
    component: BasicChartView,
    meta: {
      title: 'Basic Chart',
      requiresAuth: true
    }
  },
  {
    path: '/ui-elements/alerts',
    name: 'alerts',
    component: AlertsView,
    meta: {
      title: 'Alerts',
      requiresAuth: true
    }
  },
  {
    path: '/ui-elements/buttons',
    name: 'buttons',
    component: ButtonsView,
    meta: {
      title: 'Buttons',
      requiresAuth: true
    }
  },
  // {
  //   path: '/auth/signin',
  //   name: 'signin',
  //   component: SigninView,
  //   meta: {
  //     title: 'Signin'
  //   }
  // },
  {
    path: '/auth/signup',
    name: 'signup',
    component: SignupView,
    meta: {
      title: 'Signup',
      requiresAuth: true
    }
  },
  {
    path: '/settings/account',
    name: 'accounts',
    component: AccountView,
    meta: {
      title: 'Account',
      requiresAuth: true
    }
  },
  {
    path: '/settings/notification',
    name: 'notification',
    component: NotificationView,
    meta: {
      title: 'Notification',
      requiresAuth: true
    }
  },
  {
    path: '/settings/theme',
    name: 'theme',
    component: ThemeView,
    meta: {
      title: 'Theme',
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `Admin Loyalty Linx ${to.meta.title} | Admin - Loyalty Linx`
  next()
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'signin' }) // Redirect to SignIn if not logged in
  } else {
    next()
  }
})

export default router
