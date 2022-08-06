<script setup lang="ts">
definePageMeta({
  title: 'Create'
})
</script>

<template>
  <main>
    <div class="container py-5">
      <ClientOnly>
        <NftCreate />
      </ClientOnly>
    </div>
  </main>
</template>
