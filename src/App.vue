<script setup>
import { ref, onMounted, watch } from 'vue'
import { useDataStore } from '@/stores/data.store'
import Swal from 'sweetalert2'

const dataStore = useDataStore()

const txtBuscar = ref('')
const visible = ref(false)
const modalResumenVisible = ref(false)
const franquiciaTarjeta = ref(null)
const faseCompra = ref(0)

const buscar = () => {
  if (txtBuscar.value) {
    dataStore.productos = dataStore.productosAll.filter(producto => {
      return producto.nombre.toLowerCase().includes(txtBuscar.value.toLowerCase())
    })
  } else {
    dataStore.productos = dataStore.productosAll
  }
}
const formatearPesos = (numero) => {
  // Asegurarse de que el número sea de tipo numérico
  numero = Number(numero);

  // Configurar opciones para el formato de moneda colombiana
  const opcionesFormato = {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  };

  // Formatear el número como pesos colombianos
  const numeroFormateado = numero.toLocaleString('es-CO', opcionesFormato);

  return numeroFormateado;
}
const validarNumeroTarjeta = (event) => {
  guardarDataCompra()
  if (event.target.value.length > 18) {
    dataStore.dataCompra.pago.numeroTarjeta = event.target.value.toString().substring(0, 18)
  }
  const numeroTarjeta = event.target.value
  const patron = /^(51|52|53|54|55)/;
  if (numeroTarjeta.toString().startsWith("4")) {
    franquiciaTarjeta.value = 1
  } else if (patron.test(numeroTarjeta.toString())) {
    franquiciaTarjeta.value = 2
  } else {
    franquiciaTarjeta.value = null
  }
}
const validarFecha = (event) => {
  guardarDataCompra()
  const fecha = event.target.value
  const mes = fecha.substring(0, 2)
  if (mes > 12 || mes < 1) {
    dataStore.dataCompra.pago.fechaVencimiento = ''
  }
}
const comprar = (producto) => {
  const datos = {
    ...producto
  }
  datos.cantidadTotal = datos.cantidad
  datos.cantidad = 1
  dataStore.dataCompra.producto = datos
  dataStore.dataCompra.pago = {}
  visible.value = true
  faseCompra.value = 1
  localStorage.removeItem('faseCompra');
  localStorage.setItem('faseCompra', 1);
}
const cancelarComprar = () => {
  dataStore.dataCompra.producto = {}
  dataStore.dataCompra.pago = {}
  visible.value = false
  modalResumenVisible.value = false
  localStorage.removeItem('faseCompra');
  localStorage.removeItem('dataCompra');
}
const iniciarPago = () => {
  visible.value = false
  modalResumenVisible.value = true
  localStorage.setItem('faseCompra', 2);
}
const pagar = () => {
  modalResumenVisible.value = false
  Swal.fire({
    text: 'Pagando...',
    timer: 3000,
    didOpen: () => {
      Swal.showLoading();
    }
  }).then(() => {
    const numeroAleatorio = Math.floor(Math.random() * 2) + 1;
    if (numeroAleatorio === 1) {
      Swal.fire({
        title: "Exito",
        text: "Pagado con éxito",
        icon: "success"
      });
      localStorage.removeItem('faseCompra');
      localStorage.removeItem('dataCompra');
    } else {
      Swal.fire({
        title: "Error",
        text: "No se pudo realizar el pago",
        icon: "error"
      }).then(() => {
        modalResumenVisible.value = true
      });
    }
  });
}
const guardarDataCompra = () => {
  localStorage.setItem('dataCompra', JSON.stringify(dataStore.dataCompra));
}

onMounted(() => {
  const faseCompraLocal = localStorage.getItem('faseCompra')
  const dataCompraLocal = JSON.parse(localStorage.getItem('dataCompra'))
  if (dataCompraLocal) {
    dataStore.dataCompra = dataCompraLocal
  }
  if (parseInt(faseCompraLocal) === 1) {
    visible.value = true
  } else if (parseInt(faseCompraLocal) === 2) {
    modalResumenVisible.value = true
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <section class="bg-gray-700 h-16 flex items-center p-4 justify-between">
      <span class="text-white text-xl font-semibold">Tienda</span>
      <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" width="448" height="512" viewBox="0 0 448 512"><path fill="white" d="M313.6 304c-28.7 0-42.5 16-89.6 16c-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4M400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4c14.6 0 38.3 16 89.6 16c51.7 0 74.9-16 89.6-16c47.6 0 86.4 38.8 86.4 86.4zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0S80 64.5 80 144s64.5 144 144 144m0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96s-96-43.1-96-96s43.1-96 96-96"/></svg>
    </section>
    <form class="flex mx-3" @submit.prevent="buscar()">
      <InputText
        id="txtBuscar"
        placeholder="¿Qué estás deseando hoy?"
        class="w-full"
        v-model="txtBuscar"
        @keyup="buscar()"
      />
    </form>
    <section class="flex flex-col gap-1">
      <article
        v-for="producto in dataStore.productos"
        :key="producto.id"
        class="flex gap-2 mx-3 border-solid border border-gray-100 p-2"
      >
        <div class="flex w-full">
          <img
            :src="producto.imagen"
            :alt="producto.nombre"
            class="w-1/3 h-24"
          />
          <div class="flex flex-col w-2/3">
            <span class="text-sm text-gray-900">{{ producto.nombre }}</span>
            <span class="text-sm text-black font-semibold">COP {{ formatearPesos(producto.precio) }}</span>
            <span class="text-xs" :class="!producto.cantidad ? 'text-red-600' : ''">Cantidad: {{ producto.cantidad }}</span>
            <Button
              id="btnComprar"
              v-if="producto.cantidad"
              size="small"
              label="Comprar con tarjeta"
              icon="pi pi-shopping-cart"
              @click="comprar(producto)"
            />
          </div>
        </div>
      </article>
    </section>
  </div>
  <!-- Modal datos tarjeta -->
  <Dialog
    v-model:visible="visible"
    modal
    header="Datos de la tarjeta"
    :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :closable="false"
  >
    <form class="flex flex-col p-2 gap-2" @submit="iniciarPago()">
      <div class="flex gap-2">
        <svg v-if="franquiciaTarjeta === 1" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 1000 1000"><path fill="#1a1f71" d="M40 186c-22.087 0-40 17.908-40 40v548c0 22.091 17.922 40 40 40h920c22.087 0 40-17.908 40-40V226c0-22.091-17.922-40-40-40zm557.25 187.156c24.338 0 43.843 5.376 56.281 10.375l-8.5 53.469l-5.625-2.844c-11.587-4.999-26.47-9.81-47-9.469c-24.576 0-35.937 10.963-35.937 21.22c-.143 11.557 13.275 19.179 35.218 30.593c36.217 17.61 52.956 38.962 52.72 67.031c-.488 51.217-43.324 84.313-109.313 84.313c-28.153-.31-55.276-6.27-69.938-13.157l8.813-55.25l8.094 3.938c20.617 9.212 33.967 12.938 59.093 12.938c18.043 0 37.409-7.555 37.563-24.094c.117-10.8-8.095-18.5-32.532-30.594c-23.812-11.804-55.38-31.577-55.03-67.031c.372-47.961 44.063-81.438 106.093-81.438M88.437 381h101.344c13.647.516 24.665 4.91 28.469 19.719l21.844 112.75c.003.01-.004.051 0 .062l6.562 33.782L308.187 381h66.563l-98.938 243.438l-66.5.062l-52.937-196.438c31.498 16.687 58.314 35.994 73.844 62.563c-4.004-8.407-9.28-17.897-16.031-27.25c-7.862-10.892-24.841-24.955-31.938-30.938c-24.73-20.847-58.315-37.684-94.594-46.593zm312.782.281h65.094l-40.72 243.063H360.5zm367.656 0h49.313l51.625 243.063h-59.188s-5.872-27.924-7.781-36.438c-9.303 0-74.367-.093-81.688-.093c-2.477 6.58-13.437 36.53-13.437 36.53H640.75l94.719-222.874c6.706-15.838 18.137-20.188 33.406-20.188m4.844 65.375c-3.203 9.041-8.78 23.641-8.407 23c0 0-20.037 53.44-25.28 67.313l52.655-.032A191955.64 191955.64 0 0 0 778 467.408l-4.281-20.75z"/></svg>
        <svg v-if="franquiciaTarjeta === 2" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 199"><path d="M46.54 198.011V184.84c0-5.05-3.074-8.342-8.343-8.342c-2.634 0-5.488.878-7.464 3.732c-1.536-2.415-3.731-3.732-7.024-3.732c-2.196 0-4.39.658-6.147 3.073v-2.634h-4.61v21.074h4.61v-11.635c0-3.731 1.976-5.488 5.05-5.488c3.072 0 4.61 1.976 4.61 5.488v11.635h4.61v-11.635c0-3.731 2.194-5.488 5.048-5.488c3.074 0 4.61 1.976 4.61 5.488v11.635zm68.271-21.074h-7.463v-6.366h-4.61v6.366h-4.171v4.17h4.17v9.66c0 4.83 1.976 7.683 7.245 7.683c1.976 0 4.17-.658 5.708-1.536l-1.318-3.952c-1.317.878-2.853 1.098-3.951 1.098c-2.195 0-3.073-1.317-3.073-3.513v-9.44h7.463zm39.076-.44c-2.634 0-4.39 1.318-5.488 3.074v-2.634h-4.61v21.074h4.61v-11.854c0-3.512 1.536-5.488 4.39-5.488c.878 0 1.976.22 2.854.439l1.317-4.39c-.878-.22-2.195-.22-3.073-.22m-59.052 2.196c-2.196-1.537-5.269-2.195-8.562-2.195c-5.268 0-8.78 2.634-8.78 6.805c0 3.513 2.634 5.488 7.244 6.147l2.195.22c2.415.438 3.732 1.097 3.732 2.195c0 1.536-1.756 2.634-4.83 2.634c-3.073 0-5.488-1.098-7.025-2.195l-2.195 3.512c2.415 1.756 5.708 2.634 9 2.634c6.147 0 9.66-2.853 9.66-6.805c0-3.732-2.854-5.708-7.245-6.366l-2.195-.22c-1.976-.22-3.512-.658-3.512-1.975c0-1.537 1.536-2.415 3.951-2.415c2.635 0 5.269 1.097 6.586 1.756zm122.495-2.195c-2.635 0-4.391 1.317-5.489 3.073v-2.634h-4.61v21.074h4.61v-11.854c0-3.512 1.537-5.488 4.39-5.488c.879 0 1.977.22 2.855.439l1.317-4.39c-.878-.22-2.195-.22-3.073-.22m-58.833 10.976c0 6.366 4.39 10.976 11.196 10.976c3.073 0 5.268-.658 7.463-2.414l-2.195-3.732c-1.756 1.317-3.512 1.975-5.488 1.975c-3.732 0-6.366-2.634-6.366-6.805c0-3.951 2.634-6.586 6.366-6.805c1.976 0 3.732.658 5.488 1.976l2.195-3.732c-2.195-1.757-4.39-2.415-7.463-2.415c-6.806 0-11.196 4.61-11.196 10.976m42.588 0v-10.537h-4.61v2.634c-1.537-1.975-3.732-3.073-6.586-3.073c-5.927 0-10.537 4.61-10.537 10.976c0 6.366 4.61 10.976 10.537 10.976c3.073 0 5.269-1.097 6.586-3.073v2.634h4.61zm-16.904 0c0-3.732 2.415-6.805 6.366-6.805c3.732 0 6.367 2.854 6.367 6.805c0 3.732-2.635 6.805-6.367 6.805c-3.951-.22-6.366-3.073-6.366-6.805m-55.1-10.976c-6.147 0-10.538 4.39-10.538 10.976c0 6.586 4.39 10.976 10.757 10.976c3.073 0 6.147-.878 8.562-2.853l-2.196-3.293c-1.756 1.317-3.951 2.195-6.146 2.195c-2.854 0-5.708-1.317-6.367-5.05h15.587v-1.755c.22-6.806-3.732-11.196-9.66-11.196m0 3.951c2.853 0 4.83 1.757 5.268 5.05h-10.976c.439-2.854 2.415-5.05 5.708-5.05m114.372 7.025v-18.879h-4.61v10.976c-1.537-1.975-3.732-3.073-6.586-3.073c-5.927 0-10.537 4.61-10.537 10.976c0 6.366 4.61 10.976 10.537 10.976c3.074 0 5.269-1.097 6.586-3.073v2.634h4.61zm-16.903 0c0-3.732 2.414-6.805 6.366-6.805c3.732 0 6.366 2.854 6.366 6.805c0 3.732-2.634 6.805-6.366 6.805c-3.952-.22-6.366-3.073-6.366-6.805m-154.107 0v-10.537h-4.61v2.634c-1.537-1.975-3.732-3.073-6.586-3.073c-5.927 0-10.537 4.61-10.537 10.976c0 6.366 4.61 10.976 10.537 10.976c3.074 0 5.269-1.097 6.586-3.073v2.634h4.61zm-17.123 0c0-3.732 2.415-6.805 6.366-6.805c3.732 0 6.367 2.854 6.367 6.805c0 3.732-2.635 6.805-6.367 6.805c-3.951-.22-6.366-3.073-6.366-6.805"/><path fill="#FF5F00" d="M93.298 16.903h69.15v124.251h-69.15z"/><path fill="#EB001B" d="M97.689 79.029c0-25.245 11.854-47.637 30.074-62.126C114.373 6.366 97.47 0 79.03 0C35.343 0 0 35.343 0 79.029c0 43.685 35.343 79.029 79.029 79.029c18.44 0 35.343-6.366 48.734-16.904c-18.22-14.269-30.074-36.88-30.074-62.125"/><path fill="#F79E1B" d="M255.746 79.029c0 43.685-35.343 79.029-79.029 79.029c-18.44 0-35.343-6.366-48.734-16.904c18.44-14.488 30.075-36.88 30.075-62.125c0-25.245-11.855-47.637-30.075-62.126C141.373 6.366 158.277 0 176.717 0c43.686 0 79.03 35.563 79.03 79.029"/></svg>
        <InputText
         type="number"
          placeholder="Numero de tarjeta"
          class="w-full"
          @keydown="validarNumeroTarjeta($event)"
          v-model="dataStore.dataCompra.pago.numeroTarjeta"
          :useGrouping="false"
        />
      </div>
      <InputText
        id="txtNombreTitular"
        placeholder="Nombre del titular"
        class="w-full"
        v-model="dataStore.dataCompra.pago.nombreTitular"
        @keyup="guardarDataCompra()"
      />
      <div class="flex gap-2">
        <InputMask
          class="w-1/2"
          v-model="dataStore.dataCompra.pago.fechaVencimiento"
          mask="99/99"
          placeholder="MM/YY"
          @keyup="validarFecha($event)"
        />
        <InputMask
          class="w-1/2"
          v-model="dataStore.dataCompra.pago.cvc"
          mask="999"
          placeholder="CVC"
          @keyup="guardarDataCompra()"
        />
      </div>
      <Button
        size="small"
        label="Comprar"
        icon="pi pi-shopping-cart"
        @click="iniciarPago()"
      />
      <Button
        size="small"
        label="Cancelar"
        icon="pi pi-times"
        severity="danger"
        @click="cancelarComprar()"
      />
    </form>
  </Dialog>
  <!-- Modal resumen -->
  <Dialog
    v-model:visible="modalResumenVisible"
    modal
    header="Resumen de la compra"
    :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :closable="false"
  >
    <form class="flex flex-col p-2 gap-2" @submit="iniciarPago()">
      <article
        class="flex gap-2 mx-3 p-2 w-full"
      >
        <div class="flex w-full">
          <img
            :src="dataStore.dataCompra.producto.imagen"
            :alt="dataStore.dataCompra.producto.nombre"
            class="w-1/3 h-24"
          />
          <div class="flex flex-col w-2/3">
            <span class="text-sm text-gray-900">{{ dataStore.dataCompra.producto.nombre }}</span>
            <span class="text-sm text-black font-semibold">COP {{ formatearPesos(dataStore.dataCompra.producto.precio) }}</span>
            <span
              class="flex items-center text-xs gap-2"
              :class="!dataStore.dataCompra.producto.cantidad ? 'text-red-600' : ''"
            >
              Cantidad:
              <InputNumber
                id="cantidadComprada"
                v-model="dataStore.dataCompra.producto.cantidad"
                inputId="minmax-buttons"
                mode="decimal"
                showButtons
                :min="1"
                :max="dataStore.dataCompra.producto.cantidadTotal"
                size="small"
                inputClass="w-16"
                @update:modelValue="guardarDataCompra()"
              />
            </span>
          </div>
        </div>
      </article>
      <div class="flex w-full justify-center items-center">
        <span class="text-xl">
          Total:
          <span class="font-bold">{{ formatearPesos(dataStore.dataCompra.producto.precio * dataStore.dataCompra.producto.cantidad) }}</span>
        </span>
      </div>
      <Button
        v-if="dataStore.dataCompra.producto.cantidad"
        size="small"
        label="Pagar"
        icon="pi pi-shopping-cart"
        @click="pagar()"
      />
      <Button
        label="Cancelar"
        size="small"
        icon="pi pi-times"
        severity="danger"
        @click="cancelarComprar()"
      />
    </form>
  </Dialog>
</template>