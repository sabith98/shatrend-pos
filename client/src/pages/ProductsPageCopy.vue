<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md table-container">
      <q-table title="Products" class="q-pa-sm" :rows="productsData" :columns="columns" row-key="code"
        :selected-rows-label="getSelectedString" selection="single" v-model:selected="selected" >
        <template v-slot:top>
          <q-btn flat round color="green" icon="add" @click="productForm=true">
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>Add new product</strong>
              </q-tooltip>
          </q-btn>
          <div v-if="selected.length ===0">
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
    <!-- <NewProduct :medium="medium"/> -->
    <!-- New product form dialog -->
    <q-dialog
      v-model="productForm"
      persistent
    >
      <q-card style="width: 500px; max-width: 80vw;">
        <q-toolbar>
          <q-toolbar-title v-if="isNewProduct"><span class="text-weight-bold">Add new product</span></q-toolbar-title>
          <q-toolbar-title v-else><span class="text-weight-bold">Edit product</span></q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pt-lg">
          <q-form

            class="q-gutter-md"
          >
            <q-input
              outlined
              v-model="code"
              label="Product code *"
              hint="Unique code to Identify product"
              lazy-rules
              :rules="[
                val => val !== null && val !== '' || 'Please enter product code',
              ]"
            />
            <q-input
              outlined
              v-model="name"
              label="Product name *"
              hint="Name of the product"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type product name']"
            />
            <q-input
              outlined
              v-model="brand"
              label="Product brand"
              hint="Product manufacturer"
            />
            <q-input
              outlined
              type="number"
              v-model="price"
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
          <q-btn v-if="isNewProduct" label="Add" @click="AddProduct" />
          <q-btn v-else label="Edit" @click="editProduct" />

        <!-- <q-btn label="Reset" type="reset" flat class="q-ml-sm" />
        <q-btn label="Submit" type="submit" /> -->
      </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Form dialog end -->
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

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
  name: 'ProductsPage',
  components: {
    // NewProduct,
  },
  setup() {

    const $q = useQuasar()

    const selected = ref([])
    const productsData = ref([])
    const filter = ref('')

    const productForm = ref(false)
    const isNewProduct = ref(true)

    // const form = ref([
    //   code,
    //   name,
    //   brand,
    //   price
    // ])

    // Form constants
    const code = ref(null)
    const name = ref(null)
    const brand = ref(null)
    const price = ref(null)

    const getProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/getproducts')
        productsData.value = await response.data
        selected.value = []

      } catch (error) {
        console.log(error);
      }
    }

    const AddProduct = async () => {
      const newProduct = {
          code: code.value,
          name: name.value,
          brand: brand.value,
          price: price.value
        }
        await axios.post('http://localhost:5000/api/products/addproducts', newProduct)
          .then(() => {
              $q.notify({
                progress: true,
                message: 'Product added',
                color: 'teal',
                // textColor: 'primary',
                position: 'top'
            })
            getProducts()
            productForm.value = false
        })
        onReset()
    }

    const editProductFormBtn = () => {
      if (selected.value[0]) {
        productForm.value = true
        isNewProduct.value = false;

        code.value = selected.value[0].code;
        name.value = selected.value[0].name;
        brand.value = selected.value[0].brand;
        price.value = selected.value[0].price;
      }
    }

    const editProduct = async () => {
      const editedProduct = {
        productId: selected.value[0]._id,
        code: code.value,
        name: name.value,
        brand: brand.value,
        price: price.value
      }
      await axios.put('http://localhost:5000/api/products/updateproducts', editedProduct)
        .then((res) => {
          $q.notify({
                progress: true,
                message: res.data,
                color: 'teal',
                position: 'top'
          })
          getProducts()
          productForm.value = false
        })
    }

    const removeProduct = async () => {
      const productId = selected.value[0]._id

      if (selected.value.length =! 0) {
        await axios.delete(`http://localhost:5000/api/products/deleteproducts/${productId}`)
        .then((res) => {
          $q.notify({
              progress: true,
              message: res.data,
              color: 'teal',
              position: 'top'
          })
          getProducts()
          productForm.value = false
        })
      }
    }

    const onReset = () => {
      code.value = null
      name.value = null
      brand.value = null
      price.value = null
    }

    onMounted(getProducts)

    return {
      selected,
      columns,
      productsData,
      filter,

      // Form
      code,
      name,
      brand,
      price,

      productForm,
      isNewProduct,

      getProducts,
      AddProduct,
      editProductFormBtn,
      editProduct,
      removeProduct,
      onReset,

      onSubmit() {
        const newProduct = {
          code: code.value,
          name: name.value,
          brand: brand.value,
          price: price.value
        }
        axios.post('http://localhost:5000/api/products/addproducts', newProduct)
          .then(() => {
            setTimeout(() => {
              $q.notify({
                progress: true,
                message: 'Product added successfully',
                color: 'teal',
                position: 'top'
              })
            }, 2000)
          })
      },


      getSelectedString() {
        return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${productsData.value.length}`
      }
    }
  }
})
</script>

<style>
.table-container {
  /* background-color: aqua; */
  width: 80%;
}
</style>
