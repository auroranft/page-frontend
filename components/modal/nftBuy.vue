<script setup lang="ts">
import { JSBI } from '@/constants/jsbi';
import { AbiItem } from 'web3-utils'
import { MarketContractAddress } from '@/constants/index';
import MarketABI from '~~/constants/abis/Market_abi.json';
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

const isSale = nftInfo.value.onSale && !nftInfo.value.isBid;
const ableSale = ref<boolean>(isSale);

const { account, library, chainId } = useWeb3();
watch([account, timestamp], () => {
  if (!!account.value && !!library.value && !!chainId.value) {
    ableSale.value = isSale && (account.value !== nftInfo.value.owner);
  }
});

const paymentToken = ref<string>(null);
const paymentAmount = ref<string>('0');
const ableBalance = ref<boolean>(false);
const ableApprove = ref<boolean>(false);
// 查询余额与授权
async function queryBalanceAndApprove() {
  const marketContractAddress = MarketContractAddress[chainId.value];
  // 获取支付信息
  const marketContract = new library.value.eth.Contract(MarketABI as AbiItem[], marketContractAddress);
  const txRoundIdByNFTId = await marketContract.methods.txRoundIdByNFTId(nftInfo.value.nftId).call();
  const paymentInfo = await marketContract.methods.paymentMap(nftInfo.value.nftId, txRoundIdByNFTId).call();
  paymentToken.value = paymentInfo.payToken;
  paymentAmount.value = paymentInfo.payAmount;
  // 获取最新信息
  const newNftInfo = await marketContract.methods.nftById(nftInfo.value.nftId).call();
  const tempItem = {
    ...nftInfo,
    ...newNftInfo,
  };
  nftInfo.value = tempItem;
  // 获取当前账户余额
  const erc20Contract = new library.value.eth.Contract(TokenERC20ABI as AbiItem[], paymentInfo.payToken);
  const balance = await erc20Contract.methods.balanceOf(account.value).call();
  if (JSBI.greaterThanOrEqual(JSBI.BigInt(balance), JSBI.BigInt(paymentAmount.value))) {
    ableBalance.value = true;
  } else {
    ableBalance.value = false;
  }
  // 获取当前账户授权额度
  const allowance = await erc20Contract.methods.allowance(account.value, marketContractAddress).call();
  if (JSBI.greaterThanOrEqual(JSBI.BigInt(allowance), JSBI.BigInt(paymentAmount.value))) {
    ableApprove.value = true;
  } else {
    ableApprove.value = false;
  }
}

// NFT Buy
async function buy() {
  loading.value = true;
  const marketContractAddress = MarketContractAddress[chainId.value];
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
  const contract = new library.value.eth.Contract(MarketABI as AbiItem[], marketContractAddress);
  contract.methods.buy(nftInfo.value.token, nftInfo.value.tokenId)
  .send({ from: account.value })
  .then(() => {
    loading.value = false;
    timestamp.value = Date.parse(new Date().toString());
  }).catch((e: any) => {
    console.info(e);
    loading.value = false;
  });
}

onMounted(() => {
  if (!!library.value && !!account.value && !!chainId.value) {
    ableSale.value = isSale && (account.value !== nftInfo.value.owner);
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