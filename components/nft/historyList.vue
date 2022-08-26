<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { AuroranMarketContractAddress, EventFromBlock, NullAddress } from '@/constants/index';
import AuroranMarketABI from '~~/constants/abis/AuroranMarket.json';

import { INftListItem, IHistoryEvent } from '@/constants/interface/Nft';

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
    getNftHistoryList();
  }
});

// nft history event list
const nftHistoryList = ref<IHistoryEvent[]>([]);
// 获取NFTS
async function getNftHistoryList() {
  nftHistoryList.value = [];
  const contract = new library.value.eth.Contract(AuroranMarketABI as AbiItem[], AuroranMarketContractAddress[chainId.value]);
  contract.getPastEvents('historyEvent', { // historyEvent, allEvents
    filter: {
      token: nftInfo.nftInfo.token,
      tokenId: nftInfo.nftInfo.tokenId
    },
    fromBlock: EventFromBlock[chainId.value],
    toBlock: 'latest'
  }, async (error: any, events: any) => {
    if (!error) {
      if (events && events.length > 0) {
        const getResult = events.map((event: any) => {
          const tempItem = {
            ...event.returnValues,
            ...{
              blockHash: event.blockHash,
              blockNumber: event.blockNumber,
              token: $truncateAccount(event.returnValues.token),
              from: event.returnValues.from !== NullAddress ? $truncateAccount(event.returnValues.from) : 'Null Address',
              to: event.returnValues.to !== NullAddress ? $truncateAccount(event.returnValues.to) : '',
              payToken: $truncateAccount(event.returnValues.payToken),
              payAmount: library.value.utils.fromWei(event.returnValues.payAmount.toString()),
              createTime: $parseTime(parseInt(event.returnValues.createTime.toString())),
            },
          };
          nftHistoryList.value.push(tempItem);
        });
        await Promise.all(getResult);
        nftHistoryList.value.sort($compare("blockNumber"));
      }
    } else {
      console.info(error);
    }
  });
}

onMounted(() => {
  getNftHistoryList();
});

</script>

<template>
  <div>
    <h4>History</h4>
    <div class="table-responsive">
      <table class="table table-borderless">
        <thead>
          <tr>
            <th scope="col">EVENT</th>
            <th scope="col">PRICE</th>
            <th scope="col">FROM</th>
            <th scope="col"></th>
            <th scope="col">TO</th>
            <th scope="col">DATE</th>
          </tr>
        </thead>
        <tbody v-if="nftHistoryList.length > 0">
          <tr v-for="history in nftHistoryList" :key="history.createTime">
            <td>{{ history.name }}</td>
            <td>{{ parseFloat(history.payAmount) > 0 ? history.payAmount : '' }}</td>
            <td>{{ history.from }}</td>
            <td>></td>
            <td>{{ history.to }}</td>
            <td>{{ history.createTime }}</td>
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
