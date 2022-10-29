<template>
  <q-page class="flex flex-center">
    <div class="q-pa-xl">
      <q-table title="Products" :rows="rows" :columns="columns" row-key="name" :selected-rows-label="getSelectedString"
        selection="multiple" v-model:selected="selected" />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
// import {ref} from 'vue'

const columns = [
  {
    name: 'desc',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
]
const columns1 = [
  {
    name: 'code',
    required: true,
    label: 'Code',
    align: 'left',
    field: row => row.code,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'name', align: 'center', label: 'Name', field: 'name', sortable: true },
  { name: 'brand', label: 'Brand', field: 'brand', sortable: true },
  { name: 'price', label: 'Price', field: 'price', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
]

export default defineComponent({
  name: 'ProductsPage',
  setup() {
    const selected = ref([])

    return {
      selected,
      columns,
      rows,

      getSelectedString() {
        return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.length}`
      }
    }
  }
})
</script>
