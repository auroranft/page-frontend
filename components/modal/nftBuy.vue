<script setup lang="ts">
import { JSBI } from '@/constants/jsbi';
import { AbiItem } from 'web3-utils'
import { AuroranMarketContractAddress, AuroranNFTQueryContractAddress } from '@/constants/index';
import AuroranMarketABI from '~~/constants/abis/AuroranMarket.json';
import AuroranNFTQueryABI from '~~/constants/abis/AuroranNFTQuery.json';
import TokenERC20ABI from '~~/constants/abis/TokenERC20_abi.json';

import { INftListItem } from '@/constants/interface/Nft';

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

const isSale = nftInfo.value.nftSale.onSale && !nftInfo.value.nftSale.isBid;
const ableSale = ref<boolean>(isSale);

const { account, library, chainId } = useWeb3();
watch([account, timestamp], () => {
  if (!!account.value && !!library.value && !!chainId.value) {
    queryBalanceAndApprove();
  }
});

const paymentToken = ref<string>(null);
const paymentAmount = ref<string>('0');
// 查询余额与授权
async function queryBalanceAndApprove() {
  const marketContractAddress = AuroranMarketContractAddress[chainId.value];
  // 获取支付信息
  const marketContract = new library.value.eth.Contract(AuroranMarketABI as AbiItem[], marketContractAddress);
  const txRoundIdByNFTId = await marketContract.methods.getTxRoundIdByNFTId(nftInfo.value.nftInfo.nftId).call();
  const paymentInfo = await marketContract.methods.getPaymentMap(nftInfo.value.nftInfo.nftId, txRoundIdByNFTId).call();
  paymentToken.value = paymentInfo.payToken;
  paymentAmount.value = paymentInfo.payAmount;
  // 获取最新信息
  const queryContract = new library.value.eth.Contract(AuroranNFTQueryABI as AbiItem[], AuroranNFTQueryContractAddress[chainId.value]);
  const newNftInfo = await queryContract.methods.getNFT(nftInfo.value.nftInfo.token, nftInfo.value.nftInfo.tokenId).call();
  const tempItem = {
    ...nftInfo,
    ...newNftInfo,
  };
  nftInfo.value = tempItem;

  ableSale.value = nftInfo.value.nftSale.onSale && !nftInfo.value.nftSale.isBid && account.value !== nftInfo.value.nftSale.owner;
}

// NFT Buy
async function buy() {
  loading.value = true;
  const marketContractAddress = AuroranMarketContractAddress[chainId.value];
  // 授权
  const erc20Contract = new library.value.eth.Contract(TokenERC20ABI as AbiItem[], paymentToken.value);
  const allowance = await erc20Contract.methods.allowance(account.value, marketContractAddress).call();
  if (JSBI.lessThan(JSBI.BigInt(allowance), JSBI.BigInt(paymentAmount.value))) {
    erc20Contract.methods.approve(marketContractAddress, paymentAmount.value)
    .send({ from: account.value })
    .then(() => {
      submitBuy(marketContractAddress);
    }).catch((e: any) => {
      console.info(e);
      loading.value = false;
    });
  } else {
    submitBuy(marketContractAddress);
  }
}

function submitBuy(marketContractAddress: string) {
  // 交易
  const contract = new library.value.eth.Contract(AuroranMarketABI as AbiItem[], marketContractAddress);
  contract.methods.buy(nftInfo.value.nftInfo.token, nftInfo.value.nftInfo.tokenId)
  .send({ from: account.value })
  .then(() => {
    loading.value = false;
    timestamp.value = Date.parse(new Date().toString());
  }).catch((e: any) => {
    console.info(e);
    loading.value = false;
    timestamp.value = Date.parse(new Date().toString());
  });
}

onMounted(() => {
  if (!!library.value && !!account.value && !!chainId.value) {
    queryBalanceAndApprove();
  }
});

</script>

<template>
  <div style="display: inline-block;">
    <button class="w-100 btn btn-primary" type="button" :disabled="!ableSale || loading" @click="buy">
      <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      {{ loading ? 'Loading...' : 'Buy now' }}
    </button>
  </div>
</template>