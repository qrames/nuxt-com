<template>
  <NavButton v-if="useUserStore().Authenticated">login</NavButton>
  <DropUser v-else/>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store/user'
</script>