import { defineStore } from 'pinia';

export const useCommonStore = defineStore('common', {
  state: () => ({
    baseUrl: 'http://localhost:5000/api/',
    selectedRow: [],
    productsData: [],
    showForm: false,
    isNew: true,
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
