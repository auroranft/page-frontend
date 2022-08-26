<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { AuroranNFTQueryContractAddress } from '@/constants/index';
import AuroranNFTQueryABI from '~~/constants/abis/AuroranNFTQuery.json';

import { INftListItem } from '@/constants/interface/Nft';

definePageMeta({
  title: 'Marketplace'
})

// 加载状态
const loading = useLoading();

// 引用plugin
const { $clip, $compare } = useNuxtApp()

const { account, library, chainId } = useWeb3();
watch([account, library, chainId], () => {
  if (!!library.value && !!account.value && !!chainId.value) {
    getNftsList();
  }
});

// 复制地址
function copyAddress(address: string, event: any) {
  $clip(address, event);
}
const isCopy = useClipResult();

// nfts list
const nftsList = ref<INftListItem[]>([]);
// 获取NFTS
function getNftsList() {
  loading.value = true;
  nftsList.value = [];
  const contract = new library.value.eth.Contract(AuroranNFTQueryABI as AbiItem[], AuroranNFTQueryContractAddress[chainId.value]);
  contract.methods.getSaleNFTList()
  .call({ from: account.value })
  .then(async (value: INftListItem[]) => {
    if (value.length > 0) {
      const getResult = value.map(async (item: INftListItem, index: number) => {
        const collection = await contract.methods.getCollection(item.nftInfo.token).call();
        const { data } = await useAsyncData(index.toString(), () => $fetch(item.nftInfo.tokenURI));
        const tempItem = {
          ...item,
          ...{ nftId: item.nftInfo.nftId, collection: collection, metadata: data.value },
        };
        nftsList.value.push(tempItem);
      })
      await Promise.all(getResult);
      if (nftsList.value.length > 0) {
        nftsList.value.sort($compare("nftId"));
      }
    }
    loading.value = false;
  });
}

onMounted(() => {
  if (!!library.value && !!account.value && !!chainId.value) {
    getNftsList();
  }
});
</script>

<template>
  <main>
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <h1 class="fw-light">NFT Marketplace</h1>
          <p class="lead text-muted">MarketplaceMarketplaceMarketplace</p>
        </div>
      </div>
    </section>

    <div class="album py-5 bg-light">
      <div class="container" v-if="nftsList.length > 0">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          <div class="col" v-for="item in nftsList" :key="item.nftId">
            <div class="card shadow-sm">
              <div class="card-body">
                <p class="card-text">
                  <NuxtLink :to="`/assets/${item.collection.token}`">
                    {{ item.collection.name }}
                  </NuxtLink>
                  <i v-if="item.collection.approve" class="bi bi-patch-check-fill text-primary"></i>
                </p>
              </div>
              <NuxtLink :to="`/assets/${item.nftInfo.token}-${item.nftInfo.tokenId}`" class="ratio ratio-1x1 nft-img">
                <!-- <img src="~/assets/images/logo.png" /> -->
                <img :src="item.metadata?.fileUrl" />
              </NuxtLink>
              <div class="card-body">
                <p class="card-text">
                  <NuxtLink :to="`/assets/${item.nftInfo.token}-${item.nftInfo.tokenId}`">
                    {{ item.collection.symbol }} - {{ item.nftInfo.tokenId }}
                  </NuxtLink>
                </p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <NuxtLink :to="`/assets/${item.nftInfo.token}-${item.nftInfo.tokenId}`">
                      <button type="button" class="btn btn-sm btn-outline-primary">View</button>
                    </NuxtLink>
                  </div>
                  <small class="text-muted">ID: {{ item.nftId }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container" v-else>
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <p class="lead text-muted">No NFTs to show here..</p>
            <p>
              <NuxtLink to="/create">
                <button type="button" class="btn btn-primary">
                  Create
                </button>
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>
.nft-img {
  width: 100%;
}
.nft-img img {
  width: 100%;
  height: 100%;
}
</style>
