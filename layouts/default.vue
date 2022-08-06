<template>
  <div>
    <Header />
    <div class="wrap">
    <slot />
    </div>
    <Footer />

    <ModalConnectAccount />
  </div>
</template>

<script setup lang="ts">
  const route = useRoute()

  useHead({
    title: `${route.meta.title ? route.meta.title : 'NFT'} - AuroraNFT`,
    meta: [{ name: 'title', content: `${route.meta.title} - AuroraNFT` }]
  })
</script>

<style scoped>
.wrap {
  min-height: 75rem;
  padding-top: 4.5rem;
}
</style>