<script setup lang="ts">
const route = useRoute()

useHead({
  title: `${route.meta.title ? route.meta.title : 'NFT'} - AuroraNFT`,
  meta: [{ name: 'title', content: `${route.meta.title} - AuroraNFT` }]
})

// 加载状态
const loading = useLoading();
</script>

<template>
  <div>
    <Header />
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center position-fixed w-100 h-100 d-inline-block bg-dark"
      style="--bs-bg-opacity: .5; z-index: 9999;"
    >
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="wrap">
      <slot />
    </div>
    <Footer />

    <ModalConnectAccount />
  </div>
</template>

<style scoped>
.wrap {
  min-height: 75rem;
  padding-top: 4.5rem;
}
</style>