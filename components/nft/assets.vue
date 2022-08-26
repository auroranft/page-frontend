<script setup lang="ts">
import { INftListItem } from '@/constants/interface/Nft';

interface NftListProps {
  nftInfo: INftListItem
}
const props = defineProps<NftListProps>();
const nftInfo = props.nftInfo;

const timestamp = useTimestamp();
</script>

<template>
  <ClientOnly>
    <ModalNftBuy :nftInfo="nftInfo" :key="timestamp + 1" />
    <ModalNftOffer :nftInfo="nftInfo" class="ms-3" :key="timestamp + 2" />
  </ClientOnly>
</template>
