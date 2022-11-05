<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md table-container">
      <q-table title="Products" class="q-pa-sm" :rows="storeCustomer.productsData" :columns="columns" row-key="code"
        :selected-rows-label="getSelectedString" selection="single" v-model:selected="selectedRow" >
        <template v-slot:top>
          <div v-if="selectedRow.length === 0">
            <q-btn flat round color="green" icon="add" @click="storeCustomer.showProductForm=true">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>Add new product</strong>
              </q-tooltip>
            </q-btn>
            <q-btn flat round class="q-ml-sm disabled" color="primary" icon="edit" >
              <q-tooltip class="bg-red " anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>No product selected</strong>
              </q-tooltip>
            </q-btn>
            <q-btn flat round class="q-ml-sm disabled" color="red" icon="delete">
              <q-tooltip class="bg-red " anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>No product selected</strong>
              </q-tooltip>
            </q-btn>
          </div>

          <div v-else>
            <q-btn flat round disabled color="green" icon="add">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>Add new product</strong>
              </q-tooltip>
            </q-btn>
            <q-btn flat round class="q-ml-sm" color="primary" icon="edit" @click="editProductFormBtn" >
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>Edit product</strong>
              </q-tooltip>
            </q-btn>
            <q-btn flat round class="q-ml-sm" color="red" icon="delete" @click="removeProduct">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>Remove product</strong>
              </q-tooltip>
            </q-btn>
          </div>
          <q-space />
          <q-input borderless dense debounce="300" color="primary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>

    <!-- New product form dialog begin -->
    <q-dialog
      v-model="storeCustomer.showProductForm"
      persistent
    >
      <q-card style="width: 500px; max-width: 80vw;">
        <q-toolbar>
          <q-toolbar-title v-if="storeCustomer.isNewProduct"><span class="text-weight-bold">Add new product</span></q-toolbar-title>
          <q-toolbar-title v-else><span class="text-weight-bold">Edit product</span></q-toolbar-title>
          <q-btn @click="storeCustomer.onClosePopup" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pt-lg">
          <q-form
            class="q-gutter-md"
          >
            <q-input
              outlined
              v-model="storeCustomer.code"
              label="Product code *"
              hint="Unique code to Identify product"
              lazy-rules
              :rules="[
                val => val !== null && val !== '' || 'Please enter product code',
              ]"
            />
            <q-input
              outlined
              v-model="storeCustomer.name"
              label="Product name *"
              hint="Name of the product"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type product name']"
            />
            <q-input
              outlined
              v-model="storeCustomer.brand"
              label="Product brand"
              hint="Product manufacturer"
            />
            <q-input
              outlined
              type="number"
              v-model="storeCustomer.price"
              label="Product price*"
              hint="Product price in lkr"
              suffix="Rs"
              lazy-rules
              :rules="[
                val => val !== null && val !== '' || 'Please enter product price',
                val => val > 0 || 'Please enter a real price'
              ]"
            />
            <div align="right" class="text-teal q-py-md">
                <q-btn label="Reset" flat class="q-ml-sm" @click="storeCustomer.onReset"/>
                <q-btn v-if="storeCustomer.isNewProduct" label="Add" @click="AddProduct" />
                <q-btn v-else label="Edit" @click="editProduct" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--New product Form dialog end -->
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useCustomerStore } from 'src/stores/customers';
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios';

const columns = [
  {
    name: 'code',
    required: true,
    label: 'Code',
    align: 'left',
    // field: row => row.code,
    field: productsData => productsData.code,
    // field: 'code',
    format: val => `${val}`,
    sortable: true
  },
  { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
  { name: 'brand', label: 'Brand', field: 'brand', sortable: true },
  { name: 'price', label: 'Price', field: 'price', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
]

export default defineComponent({
  name: 'CustomersPage',
  setup() {
    const storeCustomer = useCustomerStore()
    const $q = useQuasar()

    const selectedRow = ref(storeCustomer.selectedRow)
    const productsData = ref(storeCustomer.productsData)
    const filter = ref('')

    const getProducts = async() => {
      try {
        const response = await api.get('http://localhost:5000/api/products/getproducts')
        storeCustomer.productsData = response.data
        // storeCustomer.selectedRow = []
      } catch (error) {
        console.log(error);
      }
    }

    const AddProduct = async () => {
      const newProduct = {
          code: storeCustomer.code,
          name: storeCustomer.name,
          brand: storeCustomer.brand,
          price: storeCustomer.price
        }
        await api.post('http://localhost:5000/api/products/addproducts', newProduct)
          .then(() => {
              $q.notify({
                progress: true,
                message: 'Product added',
                color: 'teal',
                position: 'top'
            })
            storeCustomer.showProductForm = false
            storeCustomer.onReset()
            storeCustomer.getProducts()
        })
    }

    const editProductFormBtn = () => {
      if (selectedRow.value[0]) {
        storeCustomer.showProductForm = true
        storeCustomer.isNewProduct = false

        storeCustomer.code = selectedRow.value[0].code;
        storeCustomer.name = selectedRow.value[0].name;
        storeCustomer.brand = selectedRow.value[0].brand;
        storeCustomer.price = selectedRow.value[0].price;
      }
    }

    const editProduct = async () => {
      const editedProduct = {
        productId: selectedRow.value[0]._id,
        code: storeCustomer.code,
        name: storeCustomer.name,
        brand: storeCustomer.brand,
        price: storeCustomer.price
      }
      await api.put('http://localhost:5000/api/products/updateproducts', editedProduct)
        .then((res) => {
          $q.notify({
                progress: true,
                message: res.data,
                color: 'teal',
                position: 'top'
          })
          storeCustomer.onReset()
          storeCustomer.getProducts()
          storeCustomer.showProductForm = false
        })
    }

    const removeProduct = async () => {
      const productId = selectedRow.value[0]._id
      if (selectedRow.value.length =! 0) {
        await api.delete(`http://localhost:5000/api/products/deleteproducts/${productId}`)
        .then((res) => {
          $q.notify({
              progress: true,
              message: res.data,
              color: 'teal',
              position: 'top'
          })
          storeCustomer.getProducts()
          storeCustomer.showProductForm = false
          selectedRow.value = []
        })
      }
    }

    onMounted(getProducts)

    return {
      storeCustomer,

      selectedRow,
      columns,
      productsData,
      filter,

      getProducts,
      AddProduct,
      editProductFormBtn,
      editProduct,
      removeProduct,

      getSelectedString() {
        return selectedRow.value.length === 0 ? '' : `${selectedRow.value.length} record${selectedRow.value.length > 1 ? 's' : ''} selected of ${storeCustomer.productsData.length}`
      }
    }
  }
})
</script>

<style>
.table-container {
  width: 80%;
}
</style>
