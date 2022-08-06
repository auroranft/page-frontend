<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { AddressMap } from '@/constants/tokensAddress'
import ERC20_ABI from '@/constants/abis/erc20.json'

interface TokenBalanceProps {
  tokenAddress: AddressMap
}

const props = defineProps<TokenBalanceProps>();

const { account, library, chainId } = useWeb3();
const address = ref<string | null>();
const name = ref<string | null>();
const symbol = ref<string | null>();
const balance = ref<string | null>();

watch([account, library, chainId], () => {
  address.value = props.tokenAddress[chainId.value];
  if (!!library.value && !!account.value) {
    const contract = new library.value.eth.Contract(ERC20_ABI as AbiItem[], address.value);
    contract.methods.name().call({ from: account.value }).then((value: any) => {
      name.value = value
    }).catch(() => {});
    contract.methods.symbol().call({ from: account.value }).then((value: any) => {
      symbol.value = value
    }).catch(() => {});
    contract.methods.balanceOf(account.value).call({ from: account.value }).then((value: any) => {
      balance.value = value
    }).catch(() => {});
    
  }
});
</script>

<template>
  <div class="card mb-3">
    <h4 class="card-header">
      {{ symbol }}
    </h4>
    <div class="card-body">
      <p class="card-text">Token Name: {{ name }}</p>
      <p class="card-text">Token Symbol: {{ symbol }}</p>
      <p class="card-text">Token Address: {{ address }}</p>
      <p class="card-text">Token Balance: {{ balance === null
        ? "Error"
        : balance
        ? `${library.utils.fromWei(balance)}`
        : "" }}</p>
    </div>
  </div>
</template>
