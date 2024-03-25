<script setup>
  import { onMounted } from 'vue'
  import { initFlowbite } from 'flowbite'
  import { useCartStore } from '@/store/cart'

  const cartStore = useCartStore()
  cartStore.initCart()
  // initialize components based on data attribute selectors
  onMounted(() => {
      initFlowbite()
  })
</script>
<template>
  <NuxtLayout>
    <template>
      <NuxtPage/>
    </template>
  </NuxtLayout>
</template>
