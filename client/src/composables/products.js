import axios from "axios";
import { ref } from "vue";

export default function useProducts() {
  const products = ref([])

  const getProducts = async () => {
    await axios.get('http://localhost:5000/api/products/getproducts')
      .then(res => {
        products.value = res.data;
      })
  }

  return {products, getProducts}
}
