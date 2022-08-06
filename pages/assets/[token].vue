<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { MarketContractAddress } from '@/constants/index';
import MarketABI from '~~/constants/abis/Market_abi.json';

import { INftListItem } from '@/constants/interface/Nft';

definePageMeta({
  title: 'NFTs - Collection'
})

const route = useRoute();
const collectionAddress = route.params.token;

// 引用plugin
const { $clip, $compare } = useNuxtApp()

const { account, library, chainId } = useWeb3();
watch([account], () => {
  if (!!account.value) {
    getNftsList();
  }
});

// 复制地址
function copyAddress(address: string | string[], event: any) {
  $clip(address, event);
}
const isCopy = useClipResult();

// nfts list
const nftsList = ref<INftListItem[]>([]);
// 获取NFTS
function getNftsList() {
  const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
  contract.methods.getCurrentNFTId()
  .call({ from: account.value })
  .then(async (value: number) => {
    if (value > 0) {
      for (let index = 1; index <= value; index++) {
        const item = await contract.methods.nftById(index).call();
        if (item.token === collectionAddress && item.onSale) {
          const collection = await contract.methods.collectionMap(item.token).call();
          const { data } = await useAsyncData(index.toString(), () => $fetch(item.tokenURI));
          const tempItem = {
            ...item,
            ...{ collection: collection, metadata: data.value },
          };
          nftsList.value.push(tempItem);
        }
      }
      nftsList.value.sort($compare("nftId"));
    }
  })
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
          <h1 class="fw-light">My Collection</h1>
          <p class="lead text-muted text-truncate">{{ collectionAddress }}</p>
          <p>
            <button :class="`btn my-2 ${isCopy ? 'btn-success' : 'btn-primary' }`" @click="copyAddress(collectionAddress, $event)">
              <i :class="`bi ${isCopy ? 'bi-clipboard2-check' : 'bi-clipboard2' }`"></i>
              {{ isCopy ? 'Cope Success' : 'Cope Address' }}
            </button>
          </p>
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
              <NuxtLink :to="`/assets/${item.token}-${item.tokenId}`" class="ratio ratio-1x1 nft-img">
                <!-- <img src="~/assets/images/logo.png"> -->
                <img :src="item.metadata?.fileUrl" />
              </NuxtLink>
              <div class="card-body">
                <p class="card-text">
                  <NuxtLink :to="`/assets/${item.token}-${item.tokenId}`">
                    {{ item.collection.symbol }} - {{ item.tokenId }}
                  </NuxtLink>
                </p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <NuxtLink :to="`/assets/${item.token}-${item.tokenId}`">
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
