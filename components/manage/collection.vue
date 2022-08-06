<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { MarketContractAddress } from '@/constants/index';
import MarketABI from '~~/constants/abis/Market_abi.json';

import { ICollectionItem } from '@/constants/interface/Collection'

// 引用plugin
const { $compare, $clip } = useNuxtApp()

// 加载状态
const loading = useLoading();
const timestamp = useTimestamp();

const { account, library, chainId } = useWeb3();
watch([account, library, chainId, timestamp], () => {
  if (!!library.value && !!account.value && !!chainId.value) {
    getCollectionList();
  }
});

const selectedAddress = ref<string>('');
// 复制地址
function copyAddress(address: string, event: any) {
  selectedAddress.value = address;
  $clip(address, event);
}
const isCopy = useClipResult();

// collection list
const collectionList = ref<ICollectionItem[]>([]);
// 获取Collection
function getCollectionList() {
  collectionList.value = [];
  loading.value = true;
  const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
  contract.methods.getCollectionTokenList()
  .call({ from: account.value })
  .then(async (tokenList: string[]) => {
    if (tokenList.length > 0) {
      const getResult = tokenList.map(async (item: string) => {
        const collection = await contract.methods.collectionMap(item).call();
        const { data } = await useAsyncData(collection.token, () => $fetch(collection.tokenURI));
        const tempItem = {
          ...collection,
          ...{ metadata: data.value },
        };
        collectionList.value.push(tempItem);
      })
      await Promise.all(getResult);
      if (collectionList.value.length > 0) {
        collectionList.value.sort($compare("createTime"));
      }
    }
    loading.value = false;
  })
}

onMounted(() => {
  getCollectionList();
});

// 审核专辑
function audit(token: string, approve: boolean) {
  loading.value = true;
  const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
  contract.methods.auditCollection(token, approve)
  .send({ from: account.value })
  .then(() => {
    timestamp.value = Date.parse(new Date().toString());
    loading.value = false;
  }).catch((e: any) => {
    console.info(e);
    loading.value = false;
  })
}
// 是否显示专辑
function show(token: string, approve: boolean) {
  loading.value = true;
  const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
  contract.methods.showCollection(token, approve)
  .send({ from: account.value })
  .then(() => {
    timestamp.value = Date.parse(new Date().toString());
    loading.value = false;
  }).catch((e: any) => {
    console.info(e);
    loading.value = false;
  })
}

</script>

<template>
  <div class="py-3 bg-light">
    <div class="container" v-if="collectionList.length > 0">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
        <div class="col" v-for="item in collectionList" :key="item.token">
          <div class="card shadow-sm position-relative">
            <span :class="`position-absolute top-0 start-100 translate-middle p-2 border border-light rounded-circle ${item.show ? 'bg-success' : 'bg-danger'}`">
              <span class="visually-hidden">Is Show</span>
            </span>
            <img src="~/assets/images/logo.png" class="card-img-top" />
            <!-- <img :src="item.metadata?.fileUrl" /> -->
            <div class="card-body">
              <h5 class="card-title">
                {{ item.symbol }} - {{ item.name }}
                <i v-if="item.approve" class="bi bi-patch-check-fill text-primary"></i>
              </h5>
              <p class="card-text">
                {{ item.metadata.description }}
              </p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                Token: <a :class="`card-link ${isCopy && item.token === selectedAddress ? 'text-success' : ''}`" @click="copyAddress(item.token, $event)">
                  {{ item.token }} <i :class="`bi ${isCopy && item.token === selectedAddress ? 'bi-clipboard2-check' : 'bi-clipboard2' }`"></i>
                </a>
              </li>
              <li class="list-group-item">Owner: {{ item.owner }}</li>
              <li class="list-group-item">Royalty: {{ item.royalty }} %</li>
              <li class="list-group-item">Create Time: {{ $parseTime(item.createTime) }}</li>
            </ul>
            <div class="card-body">
              <div class="btn-group">
                <button type="button" class="btn btn-sm btn-primary" @click="audit(item.token, !item.approve)">
                  {{ item.approve ? 'Audit Cancel' : 'Audit Pass' }}
                </button>
                <button type="button" class="btn btn-sm btn-outline-primary" @click="show(item.token, !item.show)">
                  {{ item.show ? 'Show Cancel' : 'Show Pass' }}
                </button>
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
</template>

<style scoped>
.nft-img {
  width: 100%;
}
.nft-img img {
  width: 100%;
  height: 100%;
}
.p-address {
  cursor: pointer;
}
</style>
