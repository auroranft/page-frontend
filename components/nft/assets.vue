<script setup lang="ts">
import { INftListItem } from '@/constants/interface/Nft';

interface NftListProps {
  nftInfo: INftListItem
}
const props = defineProps<NftListProps>();
const nftInfo = props.nftInfo;
</script>

<template>
  <ClientOnly>
    <ModalNftBuy :nftInfo="nftInfo" />
    <ModalNftOffer :nftInfo="nftInfo" class="ms-3" />
  </ClientOnly>
</template>
