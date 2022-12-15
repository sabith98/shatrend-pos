<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md table-container">
      <q-card class="my-card">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Products</div>
          <!-- <div class="text-subtitle2">by John Doe</div> -->
        </q-card-section>
      </q-card>
      <q-table title="Products" class="q-pa-sm" :rows="tableData" :columns="columns" row-key="code" :pagination="pagination"
        :filter="filter" :selected-rows-label="getSelectedString" selection="single" v-model:selected="selectedRow" >
        <template v-slot:top>
          <div v-if="selectedRow.length === 0">
            <q-btn flat round color="green" icon="add" @click="storeCommon.showForm=true">
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
            <q-btn flat round class="q-ml-sm" color="primary" icon="edit" @click="editForm" >
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>Edit product</strong>
              </q-tooltip>
            </q-btn>
            <q-btn flat round class="q-ml-sm" color="red" icon="delete" @click="remove">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>Remove product</strong>
              </q-tooltip>
            </q-btn>
          </div>
          <q-space />
          <q-input borderless dense debounce="300" color="primary" placeholder="Search" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
      </q-table>
    </div>

    <!-- New product form dialog begin -->
    <q-dialog
      v-model="storeCommon.showForm"
      persistent
    >
      <q-card style="width: 500px; max-width: 80vw;">
        <q-toolbar>
          <q-toolbar-title v-if="storeCommon.isNew"><span class="text-weight-bold">Add new product</span></q-toolbar-title>
          <q-toolbar-title v-else><span class="text-weight-bold">Edit product</span></q-toolbar-title>
          <q-btn @click="onClosePopup" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pt-lg">
          <q-form
            class="q-gutter-md"
          >
            <q-input
              outlined
              v-model="formData.code"
              label="Product code *"
              hint="Unique code to Identify product"
              lazy-rules
              :rules="[
                val => val !== null && val !== '' || 'Please enter product code',
              ]"
            />
            <q-input
              outlined
              v-model="formData.name"
              label="Product name *"
              hint="Name of the product"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type product name']"
            />
            <q-input
              outlined
              v-model="formData.brand"
              label="Product brand"
              hint="Product manufacturer"
            />
            <q-input
              outlined
              type="number"
              v-model="formData.price"
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
              <q-btn label="Reset" flat class="q-ml-sm" @click="onReset"/>
              <q-btn v-if="storeCommon.isNew" label="Add" @click="AddNew" />
              <q-btn v-else label="Edit" @click="edit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--New product Form dialog end -->
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { useCommonStore } from 'src/stores/common-store';
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios';

const columns = [
  {
    name: 'code',
    required: true,
    label: 'Code',
    align: 'left',
    // field: row => row.code,
    field: tableData => tableData.code,
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
    const storeCommon = useCommonStore()
    const $q = useQuasar()

    const selectedRow = ref(storeCommon.selectedRow)
    const tableData = ref([])
    // const productsData = ref(storeCommon.productsData)
    const filter = ref('')

    const formData = ref({
      code: null,
      name: null,
      brand: null,
      price: null,
    })

    const onReset = () => {
      formData.value.code = null
      formData.value.name = null
      formData.value.brand = null
      formData.value.price = null
    }

    const onClosePopup = () => {
      onReset()
      storeCommon.isNew = true
    }

    const getData = async() => {
      try {
        const response = await api.get(storeCommon.baseUrl + 'products/getproducts')
        storeCommon.productsData = response.data
        tableData.value = response.data
        // storeCommon.selectedRow = []
      } catch (error) {
        console.log(error);
      }
    }

    const AddNew = async () => {
      const newProduct = {
          code: formData.value.code,
          name: formData.value.name,
          brand: formData.value.brand,
          price: formData.value.price
        }
        await api.post(storeCommon.baseUrl + 'products/addproducts', newProduct)
          .then(() => {
              $q.notify({
                progress: true,
                message: 'Product added',
                color: 'teal',
                position: 'top'
            })
            storeCommon.showForm = false
            onReset()
            getData()
        })
    }

    const editForm = () => {
      if (selectedRow.value[0]) {
        storeCommon.showForm = true
        storeCommon.isNew = false

        formData.value.code = selectedRow.value[0].code;
        formData.value.name = selectedRow.value[0].name;
        formData.value.brand = selectedRow.value[0].brand;
        formData.value.price = selectedRow.value[0].price;
      }
    }

    const edit = async () => {
      const editedProduct = {
        productId: selectedRow.value[0]._id,
        code: formData.value.code,
        name: formData.value.name,
        brand: formData.value.brand,
        price: formData.value.price
      }
      await api.put(storeCommon.baseUrl + 'products/updateproducts', editedProduct)
      // await api.put('http://localhost:5000/api/products/updateproducts', editedProduct)
        .then((res) => {
          $q.notify({
                progress: true,
                message: res.data,
                color: 'teal',
                position: 'top'
          })
          onReset()
          getData()
          storeCommon.showForm = false
        })
    }

    const remove = async () => {
      const productId = selectedRow.value[0]._id
      if (selectedRow.value.length =! 0) {
        await api.delete(`${storeCommon.baseUrl}products/deleteproducts/${productId}`)
        .then((res) => {
          $q.notify({
              progress: true,
              message: res.data,
              color: 'teal',
              position: 'top'
          })
          getData()
          storeCommon.showForm = false
          selectedRow.value = []
        })
      }
    }

    onMounted(getData)

    return {
      pagination: {
        sortBy: 'code',
        descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
      storeCommon,

      selectedRow,
      columns,
      tableData,
      filter,
      formData,

      onReset,
      onClosePopup,
      getData,
      AddNew,
      editForm,
      edit,
      remove,

      getSelectedString() {
        return selectedRow.value.length === 0 ? '' : `${selectedRow.value.length} record${selectedRow.value.length > 1 ? 's' : ''} selected of ${storeCommon.productsData.length}`
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
