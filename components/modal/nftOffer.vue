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

interface NftListProps {
  nftInfo: INftListItem
}
const props = defineProps<NftListProps>();
nftInfo.value = props.nftInfo;

const isSale = nftInfo.value.nftSale.onSale && nftInfo.value.nftSale.isBid;
const ableSale = ref<boolean>(isSale);
const isExpire = ref<boolean>(false);

const { account, library, chainId } = useWeb3();
watch([account, isExpire], () => {
  if (!!account.value && !!library.value && !!chainId.value) {
    queryBalanceAndApprove();
  }
});

// 加载状态
const loading = useLoading();
// 提交状态
const isSubmit = useSubmit();
const timestamp = useTimestamp();

// 表单字段
interface IFormModel {
  token: string,
  tokenId: number,
  amount: number,
  agreenTerms: boolean,
}
const formModel = ref<IFormModel>({
  token: nftInfo.value.nftInfo.token,
  tokenId: nftInfo.value.nftInfo.tokenId,
  amount: 0,
  agreenTerms: false,
});

// 定义变量
const offerAmount = ref<number>(0);

const paymentToken = ref<string>(null);
const paymentAmount = ref<number>(0);
// 查询余额与授权
async function queryBalanceAndApprove() {
  formModel.value.token = nftInfo.value.nftInfo.token;
  formModel.value.tokenId = nftInfo.value.nftInfo.tokenId;
  const marketContractAddress = AuroranMarketContractAddress[chainId.value];
  // 获取支付信息
  const marketContract = new library.value.eth.Contract(AuroranMarketABI as AbiItem[], marketContractAddress);
  const txRoundIdByNFTId = await marketContract.methods.getTxRoundIdByNFTId(nftInfo.value.nftInfo.nftId).call();
  const paymentInfo = await marketContract.methods.getPaymentMap(nftInfo.value.nftInfo.nftId, txRoundIdByNFTId).call();
  paymentToken.value = paymentInfo.payToken;
  paymentAmount.value = paymentInfo.payAmount;
  isExpire.value = parseInt(paymentInfo.endTime) <= (Date.parse(new Date().toString()) / 1000);
  // 获取最新信息
  const queryContract = new library.value.eth.Contract(AuroranNFTQueryABI as AbiItem[], AuroranNFTQueryContractAddress[chainId.value]);
  const newNftInfo = await queryContract.methods.getNFT(nftInfo.value.nftInfo.token, nftInfo.value.nftInfo.tokenId).call();
  const tempItem = {
    ...nftInfo,
    ...newNftInfo,
  };
  nftInfo.value = tempItem;

  ableSale.value = nftInfo.value.nftSale.onSale && nftInfo.value.nftSale.isBid && account.value !== nftInfo.value.nftSale.owner;
}

const minPrice = ref<number>(0);
const offerListLength = ref<number>(0);
// 判断值是否可用
const isAbleAmount = ref<boolean>(false);
const isAbleAgreen = ref<boolean>(false);

async function queryLastOffer() {
  const contract = new library.value.eth.Contract(AuroranMarketABI as AbiItem[], AuroranMarketContractAddress[chainId.value]);
  const txRoundIdByNFTId = await contract.methods.getTxRoundIdByNFTId(nftInfo.value.nftInfo.nftId).call();
  const offerLast = await contract.methods.getOfferLast(nftInfo.value.nftInfo.nftId, txRoundIdByNFTId).call();
  minPrice.value = parseFloat(library.value.utils.fromWei(offerLast.amount.toString(), 'ether'));
  const offerList = await contract.methods.getOfferListMap(nftInfo.value.nftInfo.nftId, txRoundIdByNFTId).call();
  offerListLength.value = offerList.length;
  if (offerList.length > 0) {
    offerAmount.value = minPrice.value + 1;
  } else {
    offerAmount.value = minPrice.value;
  }
  isAbleAmount.value = true;
}

function changeAmount(e: any) {
  if (offerListLength.value > 0) {
    isAbleAmount.value = parseFloat(e.target.value) > minPrice.value;
  } else {
    isAbleAmount.value = parseFloat(e.target.value) >= minPrice.value;
  }
}
function changeAgreen(e: any) {
  isAbleAgreen.value = e.target.checked;
}

// NFT offer
async function offer() {
  isSubmit.value = true;
  loading.value = true;

  formModel.value.amount = offerAmount.value;
  if (formModel.value.token
    && formModel.value.tokenId
    && isAbleAmount.value
    && isAbleAgreen.value
  ) {
    const marketContractAddress = AuroranMarketContractAddress[chainId.value];
    const offerPrice = library.value.utils.toWei(formModel.value.amount.toString(), 'ether');
    // 授权
    const erc20Contract = new library.value.eth.Contract(TokenERC20ABI as AbiItem[], paymentToken.value);
    const allowance = await erc20Contract.methods.allowance(account.value, marketContractAddress).call();
    if (JSBI.lessThan(JSBI.BigInt(allowance), JSBI.BigInt(offerPrice))) {
      erc20Contract.methods.approve(marketContractAddress, offerPrice)
      .send({ from: account.value })
      .then(() => {
        submitOffer(marketContractAddress, offerPrice);
      }).catch((e: any) => {
        console.info(e);
        loading.value = false;
        isSubmit.value = false;
        timestamp.value = Date.parse(new Date().toString());
        document.getElementById('closeModalNftOffer').click();
      });
    } else {
      submitOffer(marketContractAddress, offerPrice);
    }
  } else {
    loading.value = false;
    isSubmit.value = false;
  }
}

function submitOffer(marketContractAddress: string, offerPrice: string) {
  // 报价
  const contract = new library.value.eth.Contract(AuroranMarketABI as AbiItem[], marketContractAddress);
  contract.methods.offer(
    formModel.value.token,
    formModel.value.tokenId,
    offerPrice
  )
  .send({ from: account.value })
  .then(() => {
    loading.value = false;
    isSubmit.value = false;
    timestamp.value = Date.parse(new Date().toString());
    document.getElementById('closeModalNftOffer').click();
  }).catch((e: any) => {
    console.info(e);
    loading.value = false;
    isSubmit.value = false;
    timestamp.value = Date.parse(new Date().toString());
    document.getElementById('closeModalNftOffer').click();
  })
}

onMounted(() => {
  if (!!library.value && !!account.value && !!chainId.value) {
    queryBalanceAndApprove();
    queryLastOffer();
  }
});

</script>

<template>
  <div style="display: inline-block;">
    <button class="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#modalNftOffer" :disabled="!ableSale || loading" @click="offer">
      <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      {{ loading ? 'Loading...' : 'Place an offer' }}
    </button>
    <div class="modal fade" id="modalNftOffer" tabindex="-1" aria-labelledby="modalNftOfferLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalNftOfferLabel">Place an Offer</h5>
            <button id="closeModalNftOffer" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row g-5">
              <div class="col">
                <form>
                  <div class="my-4">
                    <label for="amount" class="form-label">Price</label>
                    <input type="number" :class="`form-control ${isAbleAmount ? 'is-valid' : 'is-invalid'}`" id="amount" aria-describedby="validationAmountFeedback" v-model="offerAmount" :min="minPrice" max="999999999999999999.999999999999999999" step="0.000000000000000001" @input="changeAmount" required>
                    <div id="validationAmountFeedback" class="invalid-feedback">
                      You must input amount
                    </div>
                  </div>

                  <div class="form-check">
                    <input type="checkbox" :class="`form-check-input ${isAbleAgreen ? 'is-valid' : 'is-invalid'}`" id="agreenTerms" v-model="formModel.agreenTerms" @click="changeAgreen" required>
                    <label class="form-check-label fw-lighter" for="agreenTerms">I approve NFTrade's Terms & Conditions</label>
                  </div>

                  <hr class="my-4">

                  <button class="w-100 btn btn-primary btn-lg" type="button" :disabled="loading || !isAbleAmount || !isAbleAgreen" @click="offer">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Loading...' : 'Place Your Offer' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
