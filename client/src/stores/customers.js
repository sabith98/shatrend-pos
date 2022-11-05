import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    baseUrl: 'http://localhost:5000/api/',
    selectedRow: [],
    productsData: [],
    showProductForm: false,
    isNewProduct: true,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    // onClosePopup() {
    //   this.isNewProduct = true
    //   this.onReset()
    // },
  },
});
