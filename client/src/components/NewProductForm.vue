<template>
  <q-form
    @submit="onSubmit"
    @reset="onReset"
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
      <q-btn label="Reset" type="reset" flat class="q-ml-sm" />
      <q-btn label="Submit" type="submit" />
    </div>
  </q-form>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NewProduct',
  props: {
    medium: Boolean,
  },
  setup() {
    return {
      // medium: ref(false),
    }
  },
})
</script>
