<script setup lang="ts">
const { account } = useWeb3();

interface AccountProps {
  isTruncate?: boolean
}
const props = defineProps<AccountProps>();
const isTruncate = props.isTruncate;
</script>

<template>
  <span>
    {{ isTruncate ? $truncateAccount(account) : account }}
  </span>
</template>
