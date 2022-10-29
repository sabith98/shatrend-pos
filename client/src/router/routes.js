
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'sales', component: () => import('pages/SalesPage.vue') },
      { path: 'products', component: () => import('pages/ProductsPage.vue') },
      { path: 'customers', component: () => import('pages/CustomersPage.vue') },
      { path: 'suppliers', component: () => import('pages/SuppliersPage.vue') },
      { path: 'orders', component: () => import('pages/OrdersPage.vue') },
      { path: 'returns', component: () => import('pages/ReturnsPage.vue') },
      { path: 'employees', component: () => import('pages/EmployeesPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
