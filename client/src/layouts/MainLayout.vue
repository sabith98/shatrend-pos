<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-grey">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Shatrend
        </q-toolbar-title>

        <div>Shatrend v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard'
  },
  {
    title: 'Sales',
    icon: 'loyalty',
    route: '/sales'
  },
  {
    title: 'Products',
    icon: 'store',
    route: '/products'
  },
  {
    title: 'Customers',
    icon: 'record_voice_over',
    route: '/customers'
  },
  {
    title: 'Suppliers',
    icon: 'rss_feed',
    route: '/suppliers'
  },
  {
    title: 'Orders',
    icon: 'public',
    route: '/orders'
  },
  {
    title: 'Returns',
    icon: 'favorite',
    route: '/returns'
  },
  {
    title: 'Employees',
    icon: 'favorite',
    route: '/employees'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
