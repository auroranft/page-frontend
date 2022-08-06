<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { MarketContractAddress } from '@/constants/index';
import MarketABI from '~~/constants/abis/Market_abi.json';

import { INftListItem, INftOffer, IOfferLast } from '@/constants/interface/Nft';

// nft info
const nftInfo = ref<INftListItem>();

interface NftBuyProps {
  nftInfo: INftListItem
}
const props = defineProps<NftBuyProps>();
nftInfo.value = props.nftInfo;

// 加载状态
const loading = useLoading();
const timestamp = useTimestamp();

// 引用plugin
const { $compare, $truncateAccount, $parseTime } = useNuxtApp()

const { account, library, chainId } = useWeb3();
watch([account, timestamp], () => {
  if (!!account.value && !!library.value && !!chainId.value) {
    getNftOfferList();
  }
});

const nftOfferLast = ref<IOfferLast>();
// nft offer list
const nftOfferList = ref<INftOffer[]>([]);
// 获取NFTS
async function getNftOfferList() {
  nftOfferList.value = [];
  const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
  const txRoundIdByNFTId = await contract.methods.txRoundIdByNFTId(nftInfo.value.nftId).call();
  nftOfferLast.value = await contract.methods.offerLast(nftInfo.value.nftId, txRoundIdByNFTId).call();
  // 获取列表
  contract.methods.getOfferList(nftInfo.value.nftId, txRoundIdByNFTId)
  .call({ from: account.value })
  .then(async (value: any) => {
    if (value.length > 0) {
      const getResult = value.map((item: INftOffer) => {
        const tempItem = {
          offerId: item.offerId,
          account: $truncateAccount(item.account),
          amount: library.value.utils.fromWei(item.amount.toString()),
          createTime: $parseTime(parseInt(item.createTime.toString())),
          finishedTime: $parseTime(parseInt(item.finishedTime.toString())),
          txRoundId: item.txRoundId,
        }
        nftOfferList.value.push(tempItem as unknown as INftOffer);
      });
      await Promise.all(getResult);
      nftOfferList.value.sort($compare("offerId"));
    }
  });
  // 获取最新信息
  const newNftInfo = await contract.methods.nftById(nftInfo.value.nftId).call();
  const tempItem = {
    ...nftInfo,
    ...newNftInfo,
  };
  nftInfo.value = tempItem;
}

onMounted(() => {
  getNftOfferList();
});

// accept offer
function accept() {
  loading.value = true;
  const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
  contract.methods.deal(nftInfo.value.token, nftInfo.value.tokenId)
  .send({ from: account.value })
  .then(() => {
    getNftOfferList();
    loading.value = false;
    timestamp.value = Date.parse(new Date().toString());
  }).catch((e: any) => {
    console.info(e);
    loading.value = false;
  })
}

</script>

<template>
  <div>
    <h4>Offers</h4>
    <div class="table-responsive">
      <table class="table table-borderless">
        <thead>
          <tr>
            <th scope="col">FROM</th>
            <th scope="col">PRICE</th>
            <th scope="col">DATE</th>
            <th scope="col">STATUS</th>
            <th scope="col">ACTION</th>
          </tr>
        </thead>
        <tbody v-if="nftOfferList.length > 0">
          <tr v-for="offer in nftOfferList" :key="offer.offerId">
            <td>{{ offer.account }}</td>
            <td>{{ offer.amount }}</td>
            <td>{{ offer.createTime }}</td>
            <td v-if="!offer.finishedTime && nftInfo.onSale" class="text-primary">Active</td>
            <td v-if="!offer.finishedTime && !nftInfo.onSale" class="text-danger">Failed</td>
            <td v-if="offer.finishedTime && !nftInfo.onSale" class="text-info">Succeeded</td>
            <td>
              <button
                v-if="offer.offerId === nftOfferLast.offerId && nftInfo.owner === account && nftInfo.onSale"
                type="button"
                class="btn btn-outline-primary btn-sm"
                style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
                :disabled="loading"
                @click="accept()"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {{ loading ? 'Loading...' : 'Accept' }}
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr class="text-center fw-lighter">
            <td colspan="5">No Data</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
