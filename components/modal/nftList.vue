<script setup lang="ts">
import { AbiItem } from 'web3-utils'
import { AuroranMarketContractAddress, AuroranNFTQueryContractAddress, TokenAddressERC20 } from '@/constants/index';
import AuroranMarketABI from '~~/constants/abis/AuroranMarket.json';
import AuroranNFTQueryABI from '~~/constants/abis/AuroranNFTQuery.json';
import TokenERC721ABI from '~~/constants/abis/TokenERC721_abi.json';

import { INftListItem } from '@/constants/interface/Nft';

// nft info
const nftInfo = ref<INftListItem>();

interface NftListProps {
  nftInfo: INftListItem
}
const props = defineProps<NftListProps>();
nftInfo.value = props.nftInfo;


// 加载状态
const loading = useLoading();
// 提交状态
const isSubmit = useSubmit();
const timestamp = useTimestamp();

const { account, library, chainId } = useWeb3();
watch([account], () => {
  if (!!account.value && !!library.value && !!chainId.value) {
    getBaseInfo();
  }
});

const minDate = new Date(Date.parse(new Date().toString()) + 60 * 10 * 1000);
const maxDate = new Date(Date.parse(new Date().toString()) + 60 * 60 * 24 * 30 * 1000);
const endTime = ref<Date>(minDate);
// 表单字段
interface IFormModel {
  token: string,
  tokenId: number,
  isBid: boolean,
  payToken: string,
  payAmount: number,
  bonusRate?: number,
  endTime?: number,
  agreenTerms: boolean,
}
const formModel = ref<IFormModel>({
  token: nftInfo.value.nftInfo.token,
  tokenId: nftInfo.value.nftInfo.tokenId,
  isBid: false,
  payToken: null,
  payAmount: null,
  bonusRate: 0,
  endTime: 0,
  agreenTerms: false,
});

// 获取基本信息
const isBid = ref<boolean>(true);
const currentBonusRate = ref<number>(0);
const maxBonusRate = ref<number>(0);
async function getBaseInfo() {
  formModel.value.token = nftInfo.value.nftInfo.token;
  formModel.value.tokenId = nftInfo.value.nftInfo.tokenId;
  formModel.value.payToken = TokenAddressERC20[chainId.value];

  const contract = new library.value.eth.Contract(AuroranMarketABI as AbiItem[], AuroranMarketContractAddress[chainId.value]);
  maxBonusRate.value = await contract.methods.maxBonusRate().call({ from: account.value });
  // 获取最新信息
  const contractQuery = new library.value.eth.Contract(AuroranNFTQueryABI as AbiItem[], AuroranNFTQueryContractAddress[chainId.value]);
  const newNftInfo = await contractQuery.methods.getNFT(nftInfo.value.nftInfo.token, nftInfo.value.nftInfo.tokenId).call();
  const tempItem = {
    ...nftInfo,
    ...newNftInfo,
  };
  nftInfo.value = tempItem;
}
function changeBid(bid: boolean) {
  isBid.value = bid;
}

function changeBonus(e: any) {
  currentBonusRate.value = e.target.value;
}

// NFT list
async function nftList() {
  isSubmit.value = true;
  loading.value = true;

  formModel.value.endTime = Date.parse(new Date(endTime.value).toString()) / 1000;
  if (formModel.value.token
    && formModel.value.tokenId
    && formModel.value.payToken
    && formModel.value.payAmount
    && formModel.value.agreenTerms
  ) {
    formModel.value.isBid = isBid.value;

    // NFT 授权
    const contractForNFT = new library.value.eth.Contract(TokenERC721ABI as AbiItem[], nftInfo.value.nftInfo.token);
    const isApprovedForAll = await contractForNFT.methods.isApprovedForAll(account.value, AuroranMarketContractAddress[chainId.value]).call();
    if (!isApprovedForAll) {
      await contractForNFT.methods.setApprovalForAll(AuroranMarketContractAddress[chainId.value], true).send({ from: account.value });
    }
    // list
    const contract = new library.value.eth.Contract(AuroranMarketABI as AbiItem[], AuroranMarketContractAddress[chainId.value]);
    contract.methods.list(
      formModel.value.token,
      formModel.value.tokenId,
      formModel.value.isBid,
      formModel.value.payToken,
      library.value.utils.toWei(formModel.value.payAmount.toString(), 'ether'),
      formModel.value.bonusRate,
      formModel.value.endTime
    )
    .send({ from: account.value })
    .then(() => {
      loading.value = false;
      timestamp.value = Date.parse(new Date().toString());
      document.getElementById('closeModalNftList').click();
    }).catch((e: any) => {
      console.info(e);
      loading.value = false;
    })
  } else {
    loading.value = false;
  }
}

onMounted(() => {
  getBaseInfo();
});

</script>

<template>
  <div style="display: inline-block;">
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#modalNftList"
      :disabled="nftInfo.nftSale.onSale"
    >
      List
    </button>
    <div class="modal fade" id="modalNftList" tabindex="-1" aria-labelledby="modalNftListLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalNftListLabel">NFT List</h5>
            <button id="closeModalNftList" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row g-5">
              <div class="col">
                <form :class="`needs-validation ${isSubmit ? 'was-validated' : ''}`" novalidate>
                  <div class="my-4">
                    <label for="token" class="form-label">Token</label>
                    <input type="text" readonly class="form-control-plaintext" id="token" v-model="formModel.token" required>
                    <div class="invalid-feedback">
                      You must input token
                    </div>
                  </div>

                  <div class="my-4">
                    <label for="tokenId" class="form-label">TokenId</label>
                    <input type="text" readonly class="form-control-plaintext" id="tokenId" v-model="formModel.tokenId" required>
                    <div class="invalid-feedback">
                      You must input tokenId
                    </div>
                  </div>

                  <div class="my-4">
                    <label for="payToken" class="form-label">PayToken</label>
                    <input type="text" readonly class="form-control-plaintext" id="payToken" v-model="formModel.payToken" required>
                    <div class="invalid-feedback">
                      You must input payToken
                    </div>
                  </div>

                  <div class="my-4">
                    <label for="payAmount" class="form-label">PayAmount</label>
                    <input type="number" class="form-control" id="payAmount" v-model="formModel.payAmount" required>
                    <div class="invalid-feedback">
                      You must input payAmount
                    </div>
                  </div>

                  <div class="my-4">
                    <label for="isBid" class="form-label">Bid</label>
                    <div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="isBid" id="bidLimited" :value="false" :checked="!isBid" @change="changeBid(false)">
                        <label class="form-check-label" for="bidLimited">Limited</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="isBid" id="bidAuction" :value="true" :checked="isBid" @change="changeBid(true)">
                        <label class="form-check-label" for="bidAuction">Auction</label>
                      </div>
                    </div>
                  </div>

                  <div class="my-4" v-if="isBid">
                    <label for="bonusRate" class="form-label">Bonus Rate: {{ currentBonusRate }} %</label>
                    <input type="range" class="form-range" min="0" :max="maxBonusRate" step="1" id="bonusRate" v-model="formModel.bonusRate" @change="changeBonus" :required="isBid">
                  </div>

                  <div class="my-4" v-if="isBid">
                    <label for="endTime" class="form-label">EndTime</label>
                    <Datepicker
                      id="endTime"
                      :required="isBid"
                      :minDate="minDate"
                      :maxDate="maxDate"
                      v-model="endTime"
                      format="yyyy-MM-dd HH:mm"
                      modelType="timestamp"
                    />
                    <div class="invalid-feedback">
                      You must input endTime
                    </div>
                  </div>

                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="agreenTerms" v-model="formModel.agreenTerms" required>
                    <label class="form-check-label fw-lighter" for="agreenTerms">I approve NFTrade's Terms & Conditions</label>
                  </div>

                  <hr class="my-4">

                  <button class="w-100 btn btn-primary btn-lg" type="button" :disabled="loading" @click="nftList">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Loading...' : 'NFT List' }}
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