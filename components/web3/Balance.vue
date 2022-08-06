<script setup lang="ts">
import { CHAIN_INFO } from '@/constants/chainInfo'

const { account, library, chainId } = useWeb3();
const balance = ref<string | null>();
const nativeCurrencySymbol = ref<string | null>();

watch([account, library, chainId], () => {
  if (!!library.value && !!account.value) {
    library.value.eth
      .getBalance(account.value)
      .then((value: any) => {
        balance.value = value;
      })
      .catch(() => {});
    
    const chainInfo = CHAIN_INFO[chainId.value];
    nativeCurrencySymbol.value = chainInfo ? chainInfo.addNetworkInfo.nativeCurrency.symbol : '';
  }
});
</script>

<template>
  <span>{{
    balance === null
      ? "Error"
      : balance
      ? `${library.utils.fromWei(balance)}`
      : ""
  }} {{ nativeCurrencySymbol }}</span>
</template>
