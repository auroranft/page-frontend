<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { AuroranNFTQueryContractAddress } from '@/constants/index';
import AuroranNFTQueryABI from '~~/constants/abis/AuroranNFTQuery.json';
import TokenERC20ABI from '~~/constants/abis/TokenERC20_abi.json';

import { INftListItem } from '@/constants/interface/Nft';

definePageMeta({
  title: 'NFTs - Detail'
})

// 加载状态
const loading = useLoading();
const timestamp = useTimestamp();

const route = useRoute();
const token = route.params.token;
const tokenId = route.params.tokenId;

// 引用plugin
const { $truncateAccount, $parseTime } = useNuxtApp()

const { account, library, chainId } = useWeb3();
watch([account, timestamp], () => {
  if (!!account.value) {
    loadNftData();
  }
});

// nft info
const nftInfo = ref<INftListItem>();
// 交易信息
const paymentToken = ref<string>(null);
const paymentAmount = ref<number>(0);
const paymentTokenSymbol = ref<string>(null);
const endTime = ref<string>(null);
// 获取NFTS
async function getNftInfo() {
  loading.value = true;
  const contract = new library.value.eth.Contract(AuroranNFTQueryABI as AbiItem[], AuroranNFTQueryContractAddress[chainId.value]);
  const value = await contract.methods.getNFT(token, tokenId).call();
  const collection = await contract.methods.getCollection(value.nftInfo.token).call();
  // 获取属性信息
  const { data } = await useAsyncData(value.nftInfo.nftId, () => $fetch(value.tokenURI));
  const tempItem = {
    ...value,
    ...{ collection: collection, metadata: data.value },
  };
  nftInfo.value = tempItem;
  // 获取最新交易信息
  const txRoundIdByNFTId = await contract.methods.getTxRoundIdByNFTId(nftInfo.value.nftInfo.nftId).call();
  const paymentInfo = await contract.methods.getPaymentMap(nftInfo.value.nftInfo.nftId, txRoundIdByNFTId).call();
  paymentToken.value = paymentInfo.payToken;
  paymentAmount.value = parseFloat(library.value.utils.fromWei(paymentInfo.payAmount.toString(), 'ether'));
  endTime.value = $parseTime(parseInt(paymentInfo.endTime.toString()));
  // 获取ERC20信息
  const erc20Contract = new library.value.eth.Contract(TokenERC20ABI as AbiItem[], paymentInfo.payToken);
  paymentTokenSymbol.value = await erc20Contract.methods.symbol().call();

  loading.value = false;
}

function loadNftData() {
  if (!!library.value && !!account.value && !!chainId.value) {
    getNftInfo();
  }
}

onMounted(() => {
  loadNftData();
});
</script>

<template>
  <main>
    <section v-if="nftInfo?.nftInfo.token" class="py-5 container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-12">
          <div class="ratio ratio-1x1 nft-img">
            <img v-if="nftInfo.metadata?.fileUrl" :src="nftInfo.metadata?.fileUrl" />
            <img v-else src="~/assets/images/logo.png" />
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
                Owned: 
                <NuxtLink :to="`/account/${nftInfo.nftSale.owner}`">
                  {{ $truncateAccount(nftInfo.nftSale.owner) }}
                </NuxtLink>
              </p>
              <p class="card-text">
                Creator Royalty: {{ nftInfo.collection.royalty }} %
              </p>
              <p class="card-text">
                Listed Price: {{ paymentAmount }} {{ paymentTokenSymbol }}
              </p>
              <p class="card-text" v-if="nftInfo.nftSale.isBid">
                End Time: {{ endTime }}
              </p>
              <div class="d-flex justify-content-start align-items-center">
                <NftAssets :nftInfo="nftInfo" />
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
      <div class="mb-5" v-if="nftInfo.metadata?.properties">
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
  background-color: #f5f5f5;
}
.nft-img img {
  width: 100%;
  height: 100%;
}
</style>
