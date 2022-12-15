<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md table-container">
      <q-card class="my-card">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Suppliers</div>
          <!-- <div class="text-subtitle2">by John Doe</div> -->
        </q-card-section>
      </q-card>
      <q-table title="Products" class="q-pa-sm" :rows="tableData" :columns="columns" row-key="code" :pagination="pagination"
        :filter="filter" :selected-rows-label="getSelectedString" selection="single" v-model:selected="selectedRow" >
        <template v-slot:top>
          <div v-if="selectedRow.length === 0">
            <q-btn flat round color="green" icon="add" @click="storeCommon.showForm=true">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>Add new supplier</strong>
              </q-tooltip>
            </q-btn>
            <q-btn flat round class="q-ml-sm disabled" color="primary" icon="edit" >
              <q-tooltip class="bg-red " anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>No supplier selected</strong>
              </q-tooltip>
            </q-btn>
            <q-btn flat round class="q-ml-sm disabled" color="red" icon="delete">
              <q-tooltip class="bg-red " anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>No supplier selected</strong>
              </q-tooltip>
            </q-btn>
          </div>

          <div v-else>
            <q-btn flat round disabled color="green" icon="add">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>Add new supplier</strong>
              </q-tooltip>
            </q-btn>
            <q-btn flat round class="q-ml-sm" color="primary" icon="edit" @click="editForm" >
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>Edit supplier</strong>
              </q-tooltip>
            </q-btn>
            <q-btn flat round class="q-ml-sm" color="red" icon="delete" @click="remove">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>Remove supplier</strong>
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

    <!-- New customer form dialog begin -->
    <q-dialog
      v-model="storeCommon.showForm"
      persistent
    >
      <q-card style="width: 500px; max-width: 80vw;">
        <q-toolbar>
          <q-toolbar-title v-if="storeCommon.isNew"><span class="text-weight-bold">Add new supplier</span></q-toolbar-title>
          <q-toolbar-title v-else><span class="text-weight-bold">Edit supplier</span></q-toolbar-title>
          <q-btn @click="onClosePopup" flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pt-lg">
          <q-form
            class="q-gutter-md"
          >
            <q-input
              outlined
              v-model="formData.code"
              label="Supplier code *"
              hint="Unique code to Identify supplier"
              lazy-rules
              :rules="[
                val => val !== null && val !== '' || 'Please enter supplier code',
              ]"
            />
            <q-input
              outlined
              v-model="formData.name"
              label="Supplier name *"
              hint="Name of the supplier"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type supplier name']"
            />
            <q-input
              outlined
              v-model="formData.phone"
              label="Supplier phone No"
              hint="Contact no"
            />
            <q-input
              outlined
              v-model="formData.address"
              label="Supplier address"
              hint="Supplier place of living"
            />
            <q-input
              outlined
              v-model="formData.email"
              label="Supplier email"
              hint="Email address"
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
    <!--New customer Form dialog end -->
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
  { name: 'phone', align: 'center', label: 'Phone No', field: 'phone', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  { name: 'address', align: 'center', label: 'Address', field: 'address', sortable: true },
  { name: 'email', align: 'center', label: 'Email', field: 'email', sortable: true },
]
// const columns = [
//   {
//     name: 'code',
//     required: true,
//     label: 'Code',
//     align: 'left',
//     // field: row => row.code,
//     field: tableData => tableData.code,
//     // field: 'code',
//     format: val => `${val}`,
//     sortable: true
//   },
//   { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
//   { name: 'brand', label: 'Brand', field: 'brand', sortable: true },
//   { name: 'price', label: 'Price', field: 'price', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
// ]

export default defineComponent({
  name: 'SuppliersPage',
  setup() {
    const storeCommon = useCommonStore()
    const $q = useQuasar()

    const selectedRow = ref(storeCommon.selectedRow)
    const tableData = ref([])
    const filter = ref('')

    const formData = ref({
      code: null,
      name: null,
      phone: null,
      address: null,
      email: null,
    })

    const onReset = () => {
      formData.value.code = null
      formData.value.name = null
      formData.value.phone = null
      formData.value.address = null
      formData.value.email = null
    }

    const onClosePopup = () => {
      onReset()
      storeCommon.isNew = true
    }

    const getData = async() => {
      try {
        const response = await api.get(storeCommon.baseUrl + 'suppliers/getsuppliers')
        storeCommon.productsData = response.data
        tableData.value = response.data
        // storeCommon.selectedRow = []
      } catch (error) {
        console.log(error);
      }
    }

    const AddNew = async () => {
      const newSupplier = {
        code: formData.value.code,
        name: formData.value.name,
        phone: formData.value.phone,
        address: formData.value.address,
        email: formData.value.email
      }
      await api.post(storeCommon.baseUrl + 'suppliers/addsuppliers', newSupplier)
        .then((res) => {
            $q.notify({
              progress: true,
              message: res.data,
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
        formData.value.phone = selectedRow.value[0].phone;
        formData.value.address = selectedRow.value[0].address;
        formData.value.email = selectedRow.value[0].email;
      }
    }

    const edit = async () => {
      const editedSupplier = {
        supplierId: selectedRow.value[0]._id,
        code: formData.value.code,
        name: formData.value.name,
        phone: formData.value.phone,
        address: formData.value.address,
        email: formData.value.email
      }
      await api.put(storeCommon.baseUrl + 'suppliers/updatesuppliers', editedSupplier)
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
      const supplierId = selectedRow.value[0]._id
      if (selectedRow.value.length =! 0) {
        await api.delete(`${storeCommon.baseUrl}suppliers/deletesuppliers/${supplierId}`)
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
