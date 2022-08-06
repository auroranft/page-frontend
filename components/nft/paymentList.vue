<script setup lang="ts">
import { JSBI } from '@/constants/jsbi';
import { AbiItem } from 'web3-utils'
import { MarketContractAddress } from '@/constants/index';
import MarketABI from '~~/constants/abis/Market_abi.json';

import { INftListItem, INftPayment } from '@/constants/interface/Nft';

interface NftOfferListProps {
  nftInfo: INftListItem
}
const props = defineProps<NftOfferListProps>();
const nftInfo = props.nftInfo;

// 引用plugin
const { $compare, $truncateAccount, $parseTime } = useNuxtApp()

const { account, library, chainId } = useWeb3();
watch([account], () => {
  if (!!account.value && !!library.value && !!chainId.value) {
    getNftPaymentList();
  }
});

// nft listings
const nftPaymentList = ref<INftPayment[]>([]);
// 获取NFTS Payment List
async function getNftPaymentList() {
  nftPaymentList.value = [];
  const contract = new library.value.eth.Contract(MarketABI as AbiItem[], MarketContractAddress[chainId.value]);
  const txRoundIdByNFTId = await contract.methods.txRoundIdByNFTId(nftInfo.nftId).call();
  for (let index = 1; index <= txRoundIdByNFTId; index++) {
    const item = await contract.methods.paymentMap(nftInfo.nftId, index).call();
    const tempItem = {
      lister: $truncateAccount(item.lister),
      payToken: $truncateAccount(item.payToken),
      payAmount: JSBI.greaterThan(JSBI.BigInt(item.payAmount), JSBI.BigInt(0)) ? parseFloat(library.value.utils.fromWei(item.payAmount.toString())) : 0,
      bonusRate: item.bonusRate,
      createTime: $parseTime(parseInt(item.createTime)),
      cancelTime: $parseTime(parseInt(item.cancelTime)),
      finishedTime: $parseTime(parseInt(item.finishedTime)),
      endTime: $parseTime(parseInt(item.endTime)),
      txRoundId: item.txRoundId,
    }
    nftPaymentList.value.push(tempItem as unknown as INftPayment);
  }
  nftPaymentList.value.sort($compare("txRoundId"));
}

onMounted(() => {
  getNftPaymentList();
});

</script>

<template>
  <div>
    <h4>Listings</h4>
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
        <tbody v-if="nftPaymentList.length > 0">
          <tr v-for="payment in nftPaymentList" :key="payment.txRoundId">
            <td>{{ payment.lister }}</td>
            <td>{{ payment.payAmount }}</td>
            <td>{{ payment.createTime }}</td>
            <td v-if="!payment.cancelTime && !payment.finishedTime" class="text-primary">Active</td>
            <td v-if="payment.cancelTime && !payment.finishedTime" class="text-danger">Cancelled</td>
            <td v-if="!payment.cancelTime && payment.finishedTime" class="text-info">Finished</td>
            <td></td>
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
