import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', () => {
  // const count = ref(0)
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }
  const productos = ref([
    {
      nombre: "ASUS TUF Gaming NVIDIA GeForce RTX 4090 OC Edition Gaming",
      precio: 10286842,
      cantidad: 5,
      imagen: "/generico.png"
    },
    {
      nombre: "GIGABYTE Tarjeta gráfica GeForce RTX 4090 Gaming OC",
      precio: 7915960,
      cantidad: 2,
      imagen: "/generico.png"
    },
    {
      nombre: "GIGABYTE Tarjeta gráfica AORUS GeForce RTX 4090 Xtreme",
      precio: 10430438,
      cantidad: 4,
      imagen: "/generico.png"
    },
    {
      nombre: "MSI GeForce RTX 4090 SUPRIM Liquid X 24G",
      precio: 9794071,
      cantidad: 8,
      imagen: "/generico.png"
    },
    {
      nombre: "Gigabyte Tarjeta gráfica GeForce RTX 4090 WINDFORCE",
      precio: 8687770,
      cantidad: 1,
      imagen: "/generico.png"
    },
    {
      nombre: "MSI GeForce RTX 4090 Gaming X Trio 24G",
      precio: 9828149,
      cantidad: 0,
      imagen: "/generico.png"
    },
    {
      nombre: "Hyundai Tarjeta gráfica AORUS GeForce RTX 4090 Xtreme",
      precio: 7915960,
      cantidad: 2,
      imagen: "/generico.png"
    }
  ])
  const productosAll = ref([
    {
      nombre: "ASUS TUF Gaming NVIDIA GeForce RTX 4090 OC Edition Gaming",
      precio: 10286842,
      cantidad: 5,
      imagen: "/generico.png"
    },
    {
      nombre: "GIGABYTE Tarjeta gráfica GeForce RTX 4090 Gaming OC",
      precio: 7915960,
      cantidad: 2,
      imagen: "/generico.png"
    },
    {
      nombre: "GIGABYTE Tarjeta gráfica AORUS GeForce RTX 4090 Xtreme",
      precio: 10430438,
      cantidad: 4,
      imagen: "/generico.png"
    },
    {
      nombre: "MSI GeForce RTX 4090 SUPRIM Liquid X 24G",
      precio: 9794071,
      cantidad: 8,
      imagen: "/generico.png"
    },
    {
      nombre: "Gigabyte Tarjeta gráfica GeForce RTX 4090 WINDFORCE",
      precio: 8687770,
      cantidad: 1,
      imagen: "/generico.png"
    },
    {
      nombre: "MSI GeForce RTX 4090 Gaming X Trio 24G",
      precio: 9828149,
      cantidad: 0,
      imagen: "/generico.png"
    },
    {
      nombre: "Hyundai Tarjeta gráfica AORUS GeForce RTX 4090 Xtreme",
      precio: 7915960,
      cantidad: 2,
      imagen: "/generico.png"
    }
  ])

  const dataCompra = ref({
    pago: {},
    producto: {
      nombre: "ASUS TUF Gaming NVIDIA GeForce RTX 4090 OC Edition Gaming",
      precio: 10286842,
      cantidad: 5,
      imagen: "/generico.png",
      cantidadTotal: 5
    }
  })

  return {
    productos,
    dataCompra,
    productosAll
    // count, doubleCount, increment
  }
})
