<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { MarketContractAddress } from '@/constants/index';
import MarketABI from '~~/constants/abis/Market_abi.json';

import { INftListItem } from '@/constants/interface/Nft';

definePageMeta({
  title: 'NFTs'
})

const route = useRoute();
const token = route.params.token;
const tokenId = route.params.tokenId;

// 加载状态
const loading = useLoading();
const timestamp = useTimestamp();
// 引用plugin
const { $truncateAccount } = useNuxtApp()

const { account, library, chainId } = useWeb3();
watch([account, timestamp], () => {
  if (!!account.value) {
    loadNftData();
  }
});

// nft info
const nftInfo = ref<INftListItem>();
// 获取NFTS
async function getNftInfo() {
  const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
  const nftId = await contract.methods.nftIdMap(token, tokenId).call();
  const value = await contract.methods.nftById(nftId).call();
  const collection = await contract.methods.collectionMap(token).call();

  const { data } = await useAsyncData(nftId, () => $fetch(value.tokenURI));
  const tempItem = {
    ...value,
    ...{ collection: collection, metadata: data.value },
  };
  nftInfo.value = tempItem;
  
  // contract.methods.getNFTItem(token, tokenId)
  // .call({ from: account.value })
  // .then(async (value: any) => {
  //   const { data } = await useAsyncData(value.nftId, () => $fetch(value.tokenURI));
  //   const tempItem = {
  //     ...value,
  //     ...{ metadata: data.value },
  //   };
  //   nftInfo.value = tempItem;
  // })
}

function loadNftData() {
  if (!!library.value && !!account.value && !!chainId.value) {
    getNftInfo();
  }
}

// nft cancelled
function listCancelled() {
  if (!!token && !!tokenId) {
    loading.value = true;
    const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
    contract.methods.listCancelled(token, tokenId)
    .send({ from: account.value })
    .then(() => {
      loading.value = false;
      timestamp.value = Date.parse(new Date().toString());
    }).catch((e: any) => {
      console.info(e);
      loading.value = false;
    })
  }
}

onMounted(() => {
  loadNftData();
});

</script>

<template>
  <main>
    <section v-if="nftInfo?.token" class="py-5 container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-12">
          <div class="ratio ratio-1x1 nft-img">
            <!-- <img src="~/assets/images/logo.png" /> -->
            <img :src="nftInfo.metadata?.fileUrl" />
          </div>
        </div>
        <div class="col-lg-6 col-md-12">
          <div class="card border-0">
            <div class="card-body">
              <p class="card-text">
                <NuxtLink :to="`/account/nfts/${nftInfo.collection.token}`">
                  {{ nftInfo.collection.name }}
                </NuxtLink>
                <i v-if="nftInfo.collection.approve" class="bi bi-patch-check-fill text-primary"></i>
              </p>
            </div>
            <div class="card-body">
              <h3 class="card-title">{{ nftInfo.metadata.name }}</h3>
              <p class="card-text">
                Owned by 
                <NuxtLink :to="`/account/${nftInfo.owner}`">
                  {{ $truncateAccount(nftInfo.owner) }}
                </NuxtLink>
              </p>
              <div class="d-flex justify-content-start align-items-center">
                <NftList :nftInfo="nftInfo" :key="timestamp" />
                <button class="btn btn-danger ms-3" type="button" :disabled="!nftInfo.onSale || loading" @click="listCancelled">
                  <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  {{ loading ? 'Loading...' : 'List Cancelled' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-start align-items-center pt-5 pb-5" id="list-example">
        <a href="#history">History <i class="bi bi-link-45deg"></i></a>
        <a class="ms-3" href="#offers">Offers <i class="bi bi-link-45deg"></i></a>
        <a class="ms-3" href="#listings">Listings <i class="bi bi-link-45deg"></i></a>
      </div>
      <div class="mb-5">
        <h4>Properties</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Property</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody v-if="nftInfo.metadata.properties.length > 0">
            <tr v-for="property in nftInfo.metadata.properties" :key="property.property">
              <th>{{ property.property }}</th>
              <td>{{ property.value }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr class="text-center fw-lighter">
              <td colspan="5">No Data</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div data-bs-spy="scroll" data-bs-target="#list-example" data-bs-offset="0" data-bs-smooth-scroll="true" class="scrollspy-example" tabindex="0">
        <div class="mb-5" id="listings">
          <NftPaymentList :nftInfo="nftInfo" :key="timestamp" />
        </div>
        <div class="mb-5" id="offers">
          <NftOfferList :nftInfo="nftInfo" :key="timestamp" />
        </div>
        <div class="mb-5" id="history">
          <NftHistoryList :nftInfo="nftInfo" :key="timestamp" />
        </div>
      </div>
    </section>
    <section v-else class="py-5 container">
      <div class="row">
        <div class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </section>

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
